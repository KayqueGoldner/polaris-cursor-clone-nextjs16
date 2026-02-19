import { z } from "zod";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { convex } from "@/lib/convex-client";
import { inngest } from "@/inngest/client";

import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

const requestSchema = z.object({
  conversationId: z.string(),
  message: z.string(),
});

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const internalKey = process.env.POLARIS_CONVEX_INTERNAL_KEY;

  if (!internalKey) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }

  const body = await req.json();
  const { conversationId, message } = requestSchema.parse(body);

  const conversation = await convex.query(api.system.getConversationById, {
    internalKey,
    conversationId: conversationId as Id<"conversations">,
  });

  if (!conversation) {
    return NextResponse.json(
      { error: "Conversation not found" },
      { status: 404 },
    );
  }

  const projectId = conversation.projectId;

  const processingMessages = await convex.query(
    api.system.getProcessingMessages,
    {
      projectId,
      internalKey,
    },
  );

  if (processingMessages.length > 0) {
    // cancel all processing messages
    await Promise.all(
      processingMessages.map(async (msg) => {
        await inngest.send({
          name: "message/cancel",
          data: {
            messageId: msg._id,
          },
        });

        await convex.mutation(api.system.updateMessageStatus, {
          messageId: msg._id,
          status: "cancelled",
          internalKey,
        });
      }),
    );
  }

  await convex.mutation(api.system.createMessage, {
    internalKey,
    projectId,
    conversationId: conversationId as Id<"conversations">,
    role: "user",
    content: message,
  });

  const assistantMessageId = await convex.mutation(api.system.createMessage, {
    internalKey,
    projectId,
    conversationId: conversationId as Id<"conversations">,
    role: "assistant",
    content: "",
    status: "processing",
  });

  const event = await inngest.send({
    name: "message/sent",
    data: {
      messageId: assistantMessageId,
      conversationId: conversationId as Id<"conversations">,
      projectId: projectId,
      message,
    },
  });

  return NextResponse.json({
    success: true,
    eventId: event.ids[0],
    messageId: assistantMessageId,
  });
}
