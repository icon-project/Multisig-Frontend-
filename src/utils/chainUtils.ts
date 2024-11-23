export function prependHttpsIfNeeded(url: string): string {
  if (url.startsWith('https://')) {
    return url;
  } else {
    return 'https://' + url;
  }
}
