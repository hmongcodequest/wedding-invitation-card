/**
 * Generates a heart-shaped placeholder photo (SVG data URI) with the
 * couple's names — used when a wedding has no real photo uploaded.
 */

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function placeholderPhotoUrl(
  brideName: string,
  groomName: string
): string {
  const couple = `${brideName} & ${groomName}`.trim();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#e8c4c9"/>
      <stop offset="50%" stop-color="#f5ecdc"/>
      <stop offset="100%" stop-color="#c9a227"/>
    </linearGradient>
    <linearGradient id="heart" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#b76e79"/>
      <stop offset="100%" stop-color="#c9a227"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg)"/>
  <path d="M200,340 C80,250 40,180 40,110 C40,60 80,20 130,20 C160,20 185,40 200,65 C215,40 240,20 270,20 C320,20 360,60 360,110 C360,180 320,250 200,340 Z"
        fill="url(#heart)" opacity="0.25"/>
  <text x="200" y="120" font-family="serif" font-size="40" fill="#b76e79" text-anchor="middle" opacity="0.6">&#10084;</text>
  <text x="200" y="210" font-family="Noto Sans Lao, sans-serif" font-size="30" fill="#ffffff" text-anchor="middle" font-weight="bold">ຮູບຄູ່ບ່າວສາວ</text>
  <text x="200" y="250" font-family="Noto Sans Lao, sans-serif" font-size="18" fill="#ffffff" text-anchor="middle" opacity="0.9">${escapeXml(couple)}</text>
  <text x="200" y="330" font-family="serif" font-size="24" fill="#b76e79" text-anchor="middle" opacity="0.6">&#10084;</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}