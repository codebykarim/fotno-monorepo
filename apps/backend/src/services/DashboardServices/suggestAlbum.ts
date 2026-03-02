import OpenAI from "openai";
import { db } from "./_shared";

export const suggestAlbum = async (
  userId: string,
  galleryId: string,
  prompt: string,
) => {
  if (!process.env.OPENAI_API_KEY) {
    console.log("OPENAI_API_KEY is not configured");
    return { error: "OPENAI_API_KEY is not configured", status: 500 as const };
  }

  const gallery = await db.gallery.findFirst({
    where: { id: galleryId, userId },
    select: { id: true },
  });

  if (!gallery) {
    console.log("Gallery not found");
    return { error: "Gallery not found", status: 404 as const };
  }

  if (!prompt || !prompt.trim()) {
    console.log("Prompt is required");
    return { error: "Prompt is required", status: 400 as const };
  }

  // We work over all photos, but chunk them so each model call stays small and cheap.
  const MAX_PHOTOS_PER_CHUNK = 120;

  const photos = await db.photo.findMany({
    where: { galleryId },
    select: {
      id: true,
      aiCaption: true,
      aiTags: true,
      originalFilename: true,
    },
  });

  if (!photos.length) {
    console.log("No photos found in this gallery to suggest from");
    return {
      error: "No photos found in this gallery to suggest from",
      status: 400 as const,
    };
  }

  const systemPrompt = `You are an AI assistant that helps select photos from a gallery to create an album based on a user's natural language request.
You will be provided with photos. For each photo you will see:
- its unique ID
- optional filename
- optional AI-generated caption
- optional AI-generated tags

Use these textual descriptions to understand the photo content and the user's request.
You must return a JSON object containing an array of photo IDs that best match the user's description.
Return ONLY a valid JSON object in the exact format: {"photoIds": ["id1", "id2"]}. Do not include markdown blocks, text explanation, or anything else outside the JSON object.`;
  const trimmedPrompt = prompt.trim();

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const makePhotoDescription = (p: any): string => {
      const pieces: string[] = [`Photo ID: ${p.id}`];
      if (p.originalFilename) {
        pieces.push(`Filename: ${p.originalFilename}`);
      }
      if (p.aiCaption) {
        const caption =
          typeof p.aiCaption === "string"
            ? p.aiCaption.slice(0, 200)
            : String(p.aiCaption).slice(0, 200);
        pieces.push(`Caption: ${caption}`);
      }
      if (Array.isArray(p.aiTags) && p.aiTags.length > 0) {
        pieces.push(`Tags: ${p.aiTags.slice(0, 12).join(", ")}`);
      }
      return pieces.join("\n");
    };

    const chunks: typeof photos[][] = [];
    for (let i = 0; i < photos.length; i += MAX_PHOTOS_PER_CHUNK) {
      chunks.push(photos.slice(i, i + MAX_PHOTOS_PER_CHUNK));
    }

    const collectedIds = new Set<string>();

    for (const chunk of chunks) {
      const photosBlock = chunk.map(makePhotoDescription).join("\n---\n");

      const userPrompt = `User request: "${trimmedPrompt}"

Here is a subset of photos from the gallery.
For each photo, you are given its ID, and optionally filename, caption, and tags.
Only consider the Photo IDs listed below. Do NOT invent new IDs.

Photos:
${photosBlock}

Select the Photo IDs that best match the user's request. Respond ONLY with the JSON object.`;

      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        response_format: { type: "json_object" },
        temperature: 0.1,
        max_tokens: 256,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        console.log("Failed to generate an album suggestion for a chunk");
        continue;
      }

      const parsed = JSON.parse(content) as { photoIds?: unknown };
      const photoIds = Array.isArray(parsed.photoIds) ? parsed.photoIds : [];
      for (const id of photoIds) {
        if (typeof id === "string") {
          collectedIds.add(id);
        }
      }
    }

    // Filter out any IDs that the AI hallucinated and preserve a stable order.
    const validPhotoIds = new Set(photos.map((p: any) => p.id));
    const suggestedPhotoIds: string[] = [];
    for (const id of collectedIds) {
      if (validPhotoIds.has(id)) {
        suggestedPhotoIds.push(id);
      }
    }

    return { suggestedPhotoIds, status: 200 as const };
  } catch (error) {
    console.error("OpenAI Suggest Album Error:", error);
    return {
      error: "Failed to communicate with AI for album generation",
      status: 500 as const,
    };
  }
};
