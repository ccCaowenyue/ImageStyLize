import { TComicConfig, TSize } from '../types/stylize';
import usePromise from '../utils/usePromise';

/**
 * ApplyComicStyle function applies a comic-style effect to an image's pixel data.
 * @param {ImageData} imageData - ImageData containing pixel data.
 */
const applyComicStyle = (imageData: ImageData) => {
  const pixels = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  // Edge Detection (Convert to grayscale)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = (y * width + x) * 4;
      const r = pixels[pixelIndex];
      const g = pixels[pixelIndex + 1];
      const b = pixels[pixelIndex + 2];
      const gray = (r + g + b) / 3;
      pixels[pixelIndex] = gray;
      pixels[pixelIndex + 1] = gray;
      pixels[pixelIndex + 2] = gray;
    }
  }

  // Color Adjustment (e.g., Contrast and Saturation)
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    // Adjust colors here (e.g., increase contrast and saturation)
    pixels[i] = r * 1.5; // Increase red channel for contrast
    pixels[i + 1] = g * 1.2; // Increase green channel for saturation
    pixels[i + 2] = b * 0.8; // Decrease blue channel for contrast
  }
};

/**
 * LoadComic function takes an image URL and renders it with a comic-style effect.
 * @param {string} imageUrl - URL of the image to render.
 * @returns {Promise<HTMLCanvasElement> | false} - A Promise of HTMLCanvasElement or false.
 */
export const LoadComic = (params: TComicConfig & TSize): Promise<HTMLCanvasElement> | false => {
  const { width, height, url } = params;
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

    // Apply the comic-style effect
    applyComicStyle(imageData);

    // Put the modified image data back onto the Canvas
    context.putImageData(imageData, 0, 0);

    resolve(canvas);
  };

  return P;
};
