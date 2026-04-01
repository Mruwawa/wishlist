type RGB = [number, number, number];

function hexToRgb(hex: string): RGB {
  const clean = hex.replace("#", "");

  const bigint = parseInt(
    clean.length === 3
      ? clean.split("").map((c) => c + c).join("")
      : clean,
    16
  );

  return [
    (bigint >> 16) & 255,
    (bigint >> 8) & 255,
    bigint & 255,
  ];
}

function luminance(r: number, g: number, b: number): number {
  const channels = [r, g, b].map((value) => {
    const normalized = value / 255;

    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });

  return (
    0.2126 * channels[0] +
    0.7152 * channels[1] +
    0.0722 * channels[2]
  );
}

function contrast(rgb1: RGB, rgb2: RGB): number {
  const lum1 = luminance(...rgb1);
  const lum2 = luminance(...rgb2);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

export function getTextColorFromHex(hex: string): "#000000" | "#ffffff" {
  const bg = hexToRgb(hex);

  const white: RGB = [255, 255, 255];
  const black: RGB = [0, 0, 0];

  const contrastWithWhite = contrast(bg, white);
  const contrastWithBlack = contrast(bg, black);

  return contrastWithWhite > contrastWithBlack ? "#ffffff" : "#000000";
}