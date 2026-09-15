// 统一细线条图标(feather 风格),单色、按选中态着色。data-URI SVG,渲染清晰、商务。
const PATHS: Record<string, string> = {
  grid:
    '<rect x="3" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6"/>',
  list:
    '<line x1="8.5" y1="6" x2="20" y2="6"/><line x1="8.5" y1="12" x2="20" y2="12"/><line x1="8.5" y1="18" x2="20" y2="18"/><circle cx="4.2" cy="6" r="1.1"/><circle cx="4.2" cy="12" r="1.1"/><circle cx="4.2" cy="18" r="1.1"/>',
  chat:
    '<path d="M20.5 11.4a7.9 7.9 0 0 1-8 7.9 8 8 0 0 1-3.5-.8L4 20l1.5-4.9a7.9 7.9 0 0 1-.9-3.7A7.9 7.9 0 0 1 12.5 3.5a7.9 7.9 0 0 1 8 7.9z"/>',
  user:
    '<circle cx="12" cy="8" r="3.4"/><path d="M5.2 20a6.8 6.8 0 0 1 13.6 0"/>',
  scan:
    '<path d="M4 8.5V6.2A2.2 2.2 0 0 1 6.2 4H8.5"/><path d="M15.5 4h2.3A2.2 2.2 0 0 1 20 6.2V8.5"/><path d="M20 15.5v2.3A2.2 2.2 0 0 1 17.8 20H15.5"/><path d="M8.5 20H6.2A2.2 2.2 0 0 1 4 17.8V15.5"/><path d="M4 12h16"/>',
}

export function svgIcon(name: keyof typeof PATHS | string, color: string): string {
  const inner = PATHS[name] ?? ''
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
