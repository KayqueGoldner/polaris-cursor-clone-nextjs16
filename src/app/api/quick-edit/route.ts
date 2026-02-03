import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

import { firecrawl } from "@/lib/firecrawl";

const quickEditSchema = z.object({
  editedCode: z
    .string()
    .describe(
      "The edited version of the selected code based on the instruction",
    ),
});

const URL_REGEX = /https?:\/\/[^\s)>\]]+/g;

const QUICK_EDIT_PROMPT = `You are an expert code editing engine. Your task is to modify a specific snippet of code based on user instructions.

<context>
  <full_file_context>
{fullCode}
  </full_file_context>

  <external_documentation>
{documentation}
  </external_documentation>

  <code_to_edit>
{selectedCode}
  </code_to_edit>
</context>

<user_instruction>
{instruction}
</user_instruction>

<system_rules>
1. **Scope**: Modify ONLY the text found in <code_to_edit>. Use <full_file_context> only to understand variable scope, imports, and style.
2. **Indentation**: Strictly preserve the original indentation level (leading whitespace) of the <code_to_edit>. The output must align perfectly when pasted back into the file.
3. **Documentation**: If <external_documentation> is provided, use it to ensure correct API usage.
4. **Fallback**: If the instruction is ambiguous or impossible, return the content of <code_to_edit> unchanged.

**Output Format**: Return ONLY the raw code string.
- NO Markdown code blocks (no \`\`\`).
- NO explanations or conversational text.
</system_rules>`;

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { selectedCode, fullCode, instruction } = await request.json();

    if (!selectedCode || !instruction) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const urls: string[] = instruction.match(URL_REGEX) || [];
    let documentationContext = "";

    if (urls.length > 0) {
      const scrapedResults = await Promise.all(
        urls.map(async (url) => {
          try {
            const result = await firecrawl.scrape(url, {
              formats: ["markdown"],
            });

            if (result.markdown) {
              return `
              <document>
                <source>${url}</source>
                ${result.markdown}
              </document>
              `;
            }

            return null;
          } catch (error) {
            console.error(`Failed to scrape ${url}:`, error);
            return null;
          }
        }),
      );

      const validResults = scrapedResults.filter((result) => result !== null);
      documentationContext = `
      <documentation>
        ${validResults.join("\n\n")}
      </documentation>
      `;
    }

    const prompt = QUICK_EDIT_PROMPT.replace("{fullCode}", fullCode || "")
      .replace("{documentation}", documentationContext)
      .replace("{selectedCode}", selectedCode)
      .replace("{instruction}", instruction);

    const { output } = await generateText({
      model: google("gemini-3-flash-preview"),
      output: Output.object({ schema: quickEditSchema }),
      prompt,
    });

    return NextResponse.json({ editedCode: output.editedCode });
  } catch (error) {
    console.error("Error generating quick edit: ", error);
    return NextResponse.json(
      { error: "Failed to generate quick edit" },
      { status: 500 },
    );
  }
}
