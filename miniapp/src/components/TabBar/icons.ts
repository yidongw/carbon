// 统一的细线条图标(feather 风格),单色、可按选中态着色。用 data-URI SVG,
// 无需图标字体依赖,渲染清晰、商务。
const PATHS: Record<string, string> = {
  home:
    '<path d="M3 9.8 12 3l9 6.8"/><path d="M5 9v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9"/><path d="M9.5 21v-6.5h5V21"/>',
  tasks:
    '<rect x="7.5" y="3" width="9" height="4" rx="1.2"/><path d="M9 5H6.5A1.5 1.5 0 0 0 5 6.5v13A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 17.5 5H15"/><path d="M8.5 12h7"/><path d="M8.5 16h5"/>',
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
