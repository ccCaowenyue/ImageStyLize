import { TNoiseConfig, TSize } from '../types/stylize';
import usePromise from '../utils/usePromise';

/**
 * ApplyNoiseEffect function applies a noise effect to an image's pixel data.
 * @param {ImageData} imageData - ImageData containing pixel data.
 * @param {number} intensity - Intensity of the noise effect.
 */
const applyNoiseEffect = (imageData: ImageData, intensity: number) => {
  const pixels = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  const randomOffset = (maxOffset: number) => (Math.random() - 0.5) * maxOffset;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = (y * width + x) * 4;

      // Calculate random offsets for each color channel
      const rOffset = randomOffset(intensity);
      const gOffset = randomOffset(intensity);
      const bOffset = randomOffset(intensity);

      // Add random offsets to the pixel color values
      pixels[pixelIndex] = Math.min(255, Math.max(0, pixels[pixelIndex] + rOffset));
      pixels[pixelIndex + 1] = Math.min(255, Math.max(0, pixels[pixelIndex + 1] + gOffset));
      pixels[pixelIndex + 2] = Math.min(255, Math.max(0, pixels[pixelIndex + 2] + bOffset));
    }
  }
};

/**
 * LoadNoise function takes an image URL and renders it with a noise effect.
 * @param {string} imageUrl - URL of the image to render.
 * @param {number} intensity - Intensity of the noise effect (default: 25).
 * @returns {Promise<HTMLCanvasElement> | false} - A Promise of HTMLCanvasElement or false.
 */
export const LoadNoise = (params: TNoiseConfig & TSize): Promise<HTMLCanvasElement> | false => {
  const { width, height, url, intensity = 25 } = params;
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

    // Apply the noise effect
    applyNoiseEffect(imageData, intensity);

    // Put the modified image data back onto the Canvas
    context.putImageData(imageData, 0, 0);

    resolve(canvas);
  };

  return P;
};
