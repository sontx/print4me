export async function retry(
  fn: () => Promise<any>,
  retries: number,
  delay: number,
  maxDurationInMs: number,
): Promise<any> {
  const start = Date.now();
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, delay));
      if (Date.now() - start > maxDurationInMs) {
        break;
      }
    }
  }
  throw lastError;
}
