

/**
 * Interpolates between two colors based on a value.
 * @param color1 - The starting color in hex format (e.g., "#FF0000").
 * @param color2 - The ending color in hex format (e.g., "#00FF00").
 * @param value - The current value (between 0 and maxValue).
 * @param maxValue - The maximum value for interpolation.
 * @returns The interpolated color in hex format.
 */
export const interpolateColor = (color1: string, color2: string, value: number, maxValue: number): string => {
    // Ensure value is within bounds
    const ratio = Math.min(Math.max(value / maxValue, 0), 1);
  
    // Convert hex colors to RGB
    const hexToRgb = (hex: string) => {
      const bigint = parseInt(hex.slice(1), 16);
      return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
      };
    };
  
    const rgbToHex = (r: number, g: number, b: number) =>
      `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
  
    const startColor = hexToRgb(color1);
    const endColor = hexToRgb(color2);
  
    // Interpolate each color channel
    const r = Math.round(startColor.r + (endColor.r - startColor.r) * ratio);
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * ratio);
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * ratio);
  
    // Convert back to hex
    return rgbToHex(r, g, b);
};


/**
 * Interpolates between green, yellow, and red based on a value.
 * @param value - The current value (between 0 and maxValue).
 * @param maxValue - The maximum value for interpolation.
 * @returns The interpolated color in hex format.
 */
export const interpolateEcoColor = (value: number, maxValue: number): string => {
  // Ensure value is within bounds
  const ratio = Math.min(Math.max(value / maxValue, 0), 1);
  const firstHalf = 0.9

  // Define the gradient stops
  const green = { r: 168, g: 230, b: 163 }; // Light green (#A8E6A3)
  const yellow = { r: 255, g: 215, b: 0 }; // Yellow (#FFD700)
  const red = { r: 255, g: 0, b: 0 }; // Red (#FF0000)

  // Interpolate between green and yellow for the first half
  if (ratio <= firstHalf) {
    const adjustedRatio = ratio / firstHalf; // Normalize to 0-1
    const r = Math.round(green.r + (yellow.r - green.r) * adjustedRatio);
    const g = Math.round(green.g + (yellow.g - green.g) * adjustedRatio);
    const b = Math.round(green.b + (yellow.b - green.b) * adjustedRatio);
    return `rgb(${r}, ${g}, ${b})`;
  }

  // Interpolate between yellow and red for the second half
  const adjustedRatio = (ratio - firstHalf) / (1 - firstHalf); // Normalize to 0-1
  const r = Math.round(yellow.r + (red.r - yellow.r) * adjustedRatio);
  const g = Math.round(yellow.g + (red.g - yellow.g) * adjustedRatio);
  const b = Math.round(yellow.b + (red.b - yellow.b) * adjustedRatio);
  return `rgb(${r}, ${g}, ${b})`;
};


export function generateColorPalette(count: number): string[] {
  const colors = [];
  const saturation = 70; // percent
  const lightness = 60;  // percent

  for (let i = 0; i < count; i++) {
    const hue = Math.floor((360 / count) * i);
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }

  return colors;
}

export default {};