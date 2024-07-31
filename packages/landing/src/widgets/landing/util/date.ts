const LOCALE = 'en-US';

export function formatDate(timestamp: string): string {
  const date = new Date(timestamp);

  return `${date.toLocaleString(LOCALE, {
    month: 'short',
  })} ${date.getDate()} ′${date.getFullYear().toString().substr(-2)}`;
}
