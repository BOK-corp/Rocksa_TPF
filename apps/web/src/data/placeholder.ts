/**
 * Deterministic gemstone-style gradient placeholder. Avoids network dependency
 * on Unsplash so dev never shows broken images.
 */
export const gemPlaceholder = (
  seed: string,
  colors: [string, string] = ["#7c3aed", "#1e1b4b"],
): string => {
  // simple hash from the seed to vary the radial center per specimen
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  const cx = 30 + (Math.abs(hash) % 40);
  const cy = 30 + (Math.abs(hash >> 4) % 40);

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'>
  <defs>
    <radialGradient id='g' cx='${cx}%' cy='${cy}%' r='75%'>
      <stop offset='0%' stop-color='${colors[0]}' stop-opacity='0.95'/>
      <stop offset='55%' stop-color='${colors[0]}' stop-opacity='0.55'/>
      <stop offset='100%' stop-color='${colors[1]}'/>
    </radialGradient>
    <linearGradient id='shine' x1='0' x2='1' y1='0' y2='1'>
      <stop offset='0%' stop-color='white' stop-opacity='0.35'/>
      <stop offset='40%' stop-color='white' stop-opacity='0'/>
    </linearGradient>
  </defs>
  <rect width='600' height='600' fill='url(#g)'/>
  <polygon points='300,90 470,260 380,510 220,510 130,260' fill='url(#shine)' opacity='0.65'/>
  <polygon points='300,90 470,260 380,510 220,510 130,260' fill='none' stroke='white' stroke-opacity='0.18' stroke-width='1.5'/>
  <line x1='300' y1='90' x2='300' y2='510' stroke='white' stroke-opacity='0.12'/>
  <line x1='130' y1='260' x2='470' y2='260' stroke='white' stroke-opacity='0.12'/>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const PALETTES: Record<string, [string, string]> = {
  Purple: ["#a855f7", "#3b0764"],
  Blue: ["#3b82f6", "#0c1e4d"],
  Green: ["#10b981", "#022c22"],
  Clear: ["#cbd5e1", "#1e293b"],
  Black: ["#475569", "#0b1020"],
  Iridescent: ["#f472b6", "#1e1b4b"],
};

export const paletteFor = (color: string | undefined): [string, string] => {
  if (color && PALETTES[color]) return PALETTES[color];
  return ["#7c3aed", "#1e1b4b"];
};
