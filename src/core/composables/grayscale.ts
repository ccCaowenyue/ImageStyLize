import { TGrayScaleConfig, TSize } from '../types/stylize';
import usePromise from '../utils/usePromise';

/**
 * @description load grayscale effect
 * @param params
 * @returns void
 * @example
 * ```ts
 * Grayscale({
 *  url: 'https://images.unsplash.com/photo-1622838013147-8b2b2b2b2b2b',
 * });
 */
export const LoadGrayscale = (params: TGrayScaleConfig & TSize): Promise<HTMLCanvasElement> | false => {
  const [resolve, P] = usePromise<HTMLCanvasElement>();
  const { url } = params;
  // Get the canvas element
  const canvas = document.createElement('canvas') as HTMLCanvasElement;
  const context = canvas.getContext('2d');

  if (!context) {
    return false;
  }

  // Create an Image object and load the image
  const image = new Image();
  image.src = url; // Replace with your image URL

  // Perform black and white conversion after the image is loaded
  image.onload = () => {
    // Set the Canvas width and height to match the image's dimensions
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw the image onto the Canvas
    context.drawImage(image, 0, 0, image.width, image.height);

    // Get the pixel data of the image
    const imageData = context.getImageData(0, 0, image.width, image.height);
    const pixels = imageData.data;

    // Iterate through the pixel data and convert color values to grayscale
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      // Calculate grayscale value using the common formula: gray = 0.2989 * r + 0.5870 * g + 0.1140 * b
      const gray = 0.2989 * r + 0.587 * g + 0.114 * b;

      // Apply the grayscale value to the new pixel, making the image black and white
      pixels[i] = gray;
      pixels[i + 1] = gray;
      pixels[i + 2] = gray;
    }

    // Put the processed pixel data back onto the Canvas to display the black and white image
    context.putImageData(imageData, 0, 0);
    resolve(canvas);
  };
  return P;
};
