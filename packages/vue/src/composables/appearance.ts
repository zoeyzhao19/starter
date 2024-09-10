export function switchDarkLightMode() {
  const html = document.querySelector('html');
  const isDark = html?.classList.contains('dark');
  if (isDark) {
    html?.classList.remove('dark');
    html?.classList.add('light');
  } else {
    html?.classList.remove('light');
    html?.classList.add('dark');
  }
}
