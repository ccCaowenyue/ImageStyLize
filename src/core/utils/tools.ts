/**
 * init canvas
 * @param width
 * @param height
 * @param container
 * @param canvas
 * @private
 * @description init canvas
 * 1. create canvas
 * 2. set canvas width and height
 * 3. append canvas to container
 * 4. return canvas
 * @returns HTMLCanvasElement
 */
export const createCanvas = (
  width: number,
  height: number,
  container: HTMLElement
): HTMLCanvasElement => {
  const _canvas = document.createElement("canvas");
  _canvas.width = width;
  _canvas.height = height;
  container.appendChild(_canvas);
  _canvas.width = width;
  _canvas.height = height;
  return _canvas;
};
/**
 * load image
 * @param imageUrl
 * @description load image
 * 1. create image
 * 2. set image src
 * 3. return Promise
 * @returns Promise
 */
export const loadImage = (imageUrl: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      resolve(image);
    };
    image.onerror = (error) => {
      reject(error);
    };
  });
};

/**
 * Convert a hex color code to RGBA format.
 * @param {string} hex - Hex color code (e.g., '#FF0000' or '#FF0000FF' for RGBA with alpha).
 * @returns {object} - Object containing RGBA values (r, g, b, a).
 */
export const hexToRgba = (
  hex: string
): { r: number; g: number; b: number; a: number } => {
  // Remove the # character if it exists
  hex = hex.replace(/^#/, "");

  // Determine the number of characters in the hex code
  const hexLength = hex.length;

  // Parse the hex value into separate R, G, B, and A components
  let bigint, r, g, b, a;
  if (hexLength === 6) {
    bigint = parseInt(hex, 16);
    r = (bigint >> 16) & 255;
    g = (bigint >> 8) & 255;
    b = bigint & 255;
    a = 255; // Default alpha value if not specified
  } else if (hexLength === 8) {
    bigint = parseInt(hex, 16);
    r = (bigint >> 24) & 255;
    g = (bigint >> 16) & 255;
    b = (bigint >> 8) & 255;
    a = bigint & 255;
  } else {
    throw new Error(
      "Invalid hex color code. Use either 6 or 8 characters (with alpha)."
    );
  }

  return { r, g, b, a };
};
