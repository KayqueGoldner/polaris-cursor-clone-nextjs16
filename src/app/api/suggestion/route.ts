import { generateText, Output } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { google } from "@ai-sdk/google";
import { auth } from "@clerk/nextjs/server";

const suggestionSchema = z.object({
  suggestion: z
    .string()
    .describe(
      "The code to insert at cursor, or empty string if no complete needed",
    ),
});

const SUGGESTION_PROMPT = `You are an expert code completion engine. Your task is to complete the code at the specific cursor position identified below.

<context>
  <file_metadata>
    <filename>{fileName}</filename>
  </file_metadata>

  <cursor_position>
    <line_number>{lineNumber}</line_number>
    <text_before_cursor>{textBeforeCursor}</text_before_cursor>
    <text_after_cursor>{textAfterCursor}</text_after_cursor>
  </cursor_position>

  <surrounding_code>
    <previous_lines>{previousLines}</previous_lines>
    <current_line_text>{currentLine}</current_line_text>
    <next_lines>{nextLines}</next_lines>
  </surrounding_code>
  
  <full_file_content>
{code}
  </full_file_content>
</context>

<instructions>
Analyze the context and follow these rules strictly:

1. **Redundancy Check**: Look at <text_after_cursor> and <next_lines>. If the code intended to be written already exists immediately after the cursor, return an empty string ("").

2. **Statement Completion**: Check <text_before_cursor>. If it ends with a complete statement delimiter (like ";", "}", or ")") and no new logic is clearly initiated, return an empty string ("").

3. **Generation**: If neither of the above apply, generate the code that fills the gap at the cursor position. 
   - Use the indentation and style of <full_file_content>.
   - Your output will be inserted directly. DO NOT repeat text found in <text_before_cursor>.
   - DO NOT repeat text found in <text_after_cursor>.

**Output Format**: Return ONLY the raw code string to be inserted. Do not use Markdown blocks. If no code is needed, return an empty string.
</instructions>`;

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      fileName,
      lineNumber,
      textBeforeCursor,
      textAfterCursor,
      previousLines,
      currentLine,
      nextLines,
      code,
    } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Missing code parameter" },
        { status: 400 },
      );
    }

    const prompt = SUGGESTION_PROMPT.replace("{fileName}", fileName)
      .replace("{lineNumber}", lineNumber.toString())
      .replace("{textBeforeCursor}", textBeforeCursor)
      .replace("{textAfterCursor}", textAfterCursor)
      .replace("{previousLines}", previousLines || "")
      .replace("{currentLine}", currentLine)
      .replace("{nextLines}", nextLines || "")
      .replace("{code}", code);

    const { output } = await generateText({
      model: google("gemini-3-flash-preview"),
      output: Output.object({ schema: suggestionSchema }),
      prompt,
    });

    return NextResponse.json({ suggestion: output.suggestion });
  } catch (error) {
    console.error("Error generating suggestion: ", error);
    return NextResponse.json(
      { error: "Failed to generate suggestion" },
      { status: 500 },
    );
  }
}
