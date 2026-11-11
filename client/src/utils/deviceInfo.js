export function collectDeviceInfo() {
  const userAgent = navigator.userAgent || '';
  const platform = navigator.platform || 'unknown';
  const language = navigator.language || 'unknown';
  const screen = `${window.screen.width}x${window.screen.height}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown';

  return {
    userAgent,
    platform,
    language,
    screen,
    timezone,
  };
}
