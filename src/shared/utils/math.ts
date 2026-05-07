export function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const milliseconds = ms % 1000;

  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  }
  return `${remainingSeconds}.${milliseconds.toString().padStart(3, '0')}`;
}

export function calculateAverage(times: number[], count: number): number | null {
  if (times.length < count) return null;
  const sorted = [...times].sort((a, b) => a - b);
  const slice = sorted.slice(0, count);
  return slice.reduce((a, b) => a + b, 0) / count;
}
