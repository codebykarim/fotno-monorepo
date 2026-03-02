import OpenAI from "openai";
import { db } from "./_shared";
import { getPresignedDownloadUrl } from "../../utils/s3";

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

  // Hard cap on photos per generation to stay within OpenAI limits.
  // Using gpt-4o-mini with a higher TPM lets us safely handle up to 50 here.
  const MAX_PHOTOS_PER_CALL = 50;

  const photos = await db.photo.findMany({
    where: { galleryId },
    select: {
      id: true,
      s3Key: true,
      thumbnailKey: true,
      previewKey: true,
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

  // We limit to a subset of photos to avoid hitting OpenAI payload/TPM limits
  // and to keep costs reasonable.
  const cappedPhotos = photos.slice(0, MAX_PHOTOS_PER_CALL);

  const photoDescriptions = await Promise.all(
    cappedPhotos.map(async (p: any) => {
      const keyStr = p.thumbnailKey || p.previewKey || p.s3Key;
      let url = "";
      if (keyStr) {
        url = await getPresignedDownloadUrl(keyStr, 3600);
      }
      return { id: p.id, url, filename: p.originalFilename };
    }),
  );

  const systemPrompt = `You are an AI assistant that helps select photos from a gallery to create an album based on a user's natural language request.
You will be provided with photos. For each photo you will see its unique ID and optional filename, followed by the image itself.
Analyze the visual content of the images and the user's request.
You must return a JSON object containing an array of photo IDs that best match the user's description.
Return ONLY a valid JSON object in the exact format: {"photoIds": ["id1", "id2"]}. Do not include markdown blocks, text explanation, or anything else outside the JSON object.`;

  const userPrompt = `User request: "${prompt}"

Below is the list of photos in the gallery. For each photo you will see:
- The line "Photo ID: <id>"
- Optionally a "Filename: <filename>" line (may be null or empty)
- Then the image itself

Select the appropriate photo IDs. Respond ONLY with the JSON object.`;

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
          { type: "text", text: userPrompt },
          ...photoDescriptions
            .filter((p) => p.url)
            .flatMap(
              (p): OpenAI.Chat.ChatCompletionContentPart[] => [
                {
                  type: "text",
                  text: `Photo ID: ${p.id}${
                    p.filename ? `\nFilename: ${p.filename}` : ""
                  }`,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: p.url,
                    detail: "low",
                  },
                },
              ],
            ),
        ],
      },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const content = response.choices[0]?.message?.content;
    console.log("content", content);
    if (!content) {
      console.log("Failed to generate an album suggestion");
      return {
        error: "Failed to generate an album suggestion",
        status: 500 as const,
      };
    }

    const { photoIds } = JSON.parse(content) as { photoIds: string[] };

    // Filter out any IDs that the AI hallucinated
    const validPhotoIds = new Set(photos.map((p: any) => p.id));
    const suggestedPhotoIds = (Array.isArray(photoIds) ? photoIds : []).filter(
      (id) => validPhotoIds.has(id),
    );

    return { suggestedPhotoIds, status: 200 as const };
  } catch (error) {
    console.error("OpenAI Suggest Album Error:", error);
    return {
      error: "Failed to communicate with AI for album generation",
      status: 500 as const,
    };
  }
};
