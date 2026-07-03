const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || '';

export async function syncToSheet(
  action: 'upsert' | 'delete',
  type: 'product' | 'blog',
  data: Record<string, unknown> & { id?: string }
): Promise<void> {
  if (!GOOGLE_SCRIPT_URL) return;

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, type, data }),
    });
  } catch {
    // Webhook sync is best-effort; don't fail the API request
  }
}
