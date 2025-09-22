export interface EmailCheckResult {
  exists: boolean;
  error?: string;
}

/**
 * Check if an email is already registered using the backend API
 */
export async function checkEmailExists(
  email: string
): Promise<EmailCheckResult> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/check-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      }
    );

    if (!response.ok) {
      // If the API call fails, assume email doesn't exist (safer for UX)
      return {
        exists: false,
        error: `API error: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      exists: data.exists,
    };
  } catch (error) {
    console.error("Error checking email:", error);
    // On any error, assume email doesn't exist (better UX for new users)
    return {
      exists: false,
      error: error instanceof Error ? error.message : "Unable to check email",
    };
  }
}
