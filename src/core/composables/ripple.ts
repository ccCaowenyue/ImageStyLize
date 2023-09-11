import { TRippleConfig, TSize } from '../types/stylize';
import usePromise from '../utils/usePromise';

/**
 * ApplyRippleEffect function applies a ripple effect to an image's pixel data.
 * @param {ImageData} imageData - ImageData containing pixel data.
 * @param {number} amplitude - Amplitude of the ripple effect.
 * @param {number} frequency - Frequency of the ripple effect.
 */
const applyRippleEffect = (imageData: ImageData, amplitude: number, frequency: number) => {
  const pixels = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const time = performance.now() / 1000; // Current time in seconds

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = (y * width + x) * 4;

      // Calculate displacement based on amplitude, frequency, and time
      const displacementX = Math.sin(x * frequency + time) * amplitude;
      const displacementY = Math.sin(y * frequency + time) * amplitude;

      // Calculate the new pixel coordinates with displacement
      const newX = x + displacementX;
      const newY = y + displacementY;

      // Interpolate pixel color from the original image
      const color = interpolateColor(imageData, newX, newY);

      // Update the pixel with the interpolated color
      pixels[pixelIndex] = color.r;
      pixels[pixelIndex + 1] = color.g;
      pixels[pixelIndex + 2] = color.b;
    }
  }
};

/**
 * InterpolateColor function interpolates the color of a pixel at non-integer coordinates.
 * @param {ImageData} imageData - ImageData containing pixel data.
 * @param {number} x - X-coordinate of the pixel.
 * @param {number} y - Y-coordinate of the pixel.
 * @returns {object} - Object containing interpolated RGBA color values.
 */
const interpolateColor = (imageData: ImageData, x: number, y: number): { r: number; g: number; b: number; a: number } => {
  const pixels = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  // Clamp coordinates to image boundaries
  x = Math.min(Math.max(x, 0), width - 1);
  y = Math.min(Math.max(y, 0), height - 1);

  // Calculate the pixel coordinates
  const x0 = Math.floor(x);
  const x1 = Math.ceil(x);
  const y0 = Math.floor(y);
  const y1 = Math.ceil(y);

  // Calculate the fractional part for interpolation
  const dx = x - x0;
  const dy = y - y0;

  // Calculate interpolated color values for each channel (RGBA)
  const interpolateChannel = (channelIndex: number) => {
    const c00 = pixels[(y0 * width + x0) * 4 + channelIndex];
    const c01 = pixels[(y0 * width + x1) * 4 + channelIndex];
    const c10 = pixels[(y1 * width + x0) * 4 + channelIndex];
    const c11 = pixels[(y1 * width + x1) * 4 + channelIndex];

    const interpolatedValue = (1 - dx) * (1 - dy) * c00 + dx * (1 - dy) * c01 + (1 - dx) * dy * c10 + dx * dy * c11;

    return Math.round(interpolatedValue);
  };

  const r = interpolateChannel(0);
  const g = interpolateChannel(1);
  const b = interpolateChannel(2);
  const a = interpolateChannel(3);

  return { r, g, b, a };
};

/**
 * LoadRipple function takes an image URL and renders it with a ripple effect.
 * @param {string} imageUrl - URL of the image to render.
 * @param {number} amplitude - Amplitude of the ripple effect.
 * @param {number} frequency - Frequency of the ripple effect.
 * @returns {Promise<HTMLCanvasElement> | false} - A Promise of HTMLCanvasElement or false.
 */
export const LoadRipple = (params: TRippleConfig & TSize): Promise<HTMLCanvasElement> | false => {
  const { width, height, url, amplitude = 10, frequency = 0.03 } = params;
  if (!url) {
    return false;
  }

  const [resolve, P] = usePromise<HTMLCanvasElement>();

  // Create an image element to load the image
  const image = new Image();
  image.src = url;

  image.onload = () => {
    // Create a Canvas to manipulate the image
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      return false;
    }

    // Set the Canvas width and height to match the image
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw the image onto the Canvas
    context.drawImage(image, 0, 0);

    // Get the pixel data of the image
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    // Apply the ripple effect
    applyRippleEffect(imageData, amplitude, frequency);

    // Put the modified image data back onto the Canvas
    context.putImageData(imageData, 0, 0);

    resolve(canvas);
  };

  return P;
};
