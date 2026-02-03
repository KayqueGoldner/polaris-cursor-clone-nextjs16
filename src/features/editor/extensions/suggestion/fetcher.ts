import ky from "ky";
import { z } from "zod";
import { toast } from "sonner";

const suggestionRequestSchema = z.object({
  fileName: z.string(),
  lineNumber: z.number(),
  textBeforeCursor: z.string(),
  textAfterCursor: z.string(),
  previousLines: z.string(),
  currentLine: z.string(),
  nextLines: z.string(),
  code: z.string(),
});

const suggestionResponseSchema = z.object({
  suggestion: z.string(),
});

type SuggestionRequest = z.infer<typeof suggestionRequestSchema>;
type SuggestionResponse = z.infer<typeof suggestionResponseSchema>;

export const fetcher = async (
  payload: SuggestionRequest,
  signal: AbortSignal,
): Promise<string | null> => {
  try {
    const validatePayload = suggestionRequestSchema.parse(payload);

    const response = await ky
      .post("/api/suggestion", {
        json: validatePayload,
        signal,
        timeout: 10_000,
        retry: 0,
      })
      .json<SuggestionResponse>();

    const validateResponse = suggestionResponseSchema.parse(response);

    return validateResponse.suggestion || null;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return null;
    }

    console.error("Error fetching suggestion: ", error);
    toast.error("Failed to fetch suggestion");

    return null;
  }
};
