import { TRmColorConfig, TSize } from '../types/stylize';
import { hexToRgba } from '../utils/tools';
import usePromise from '../utils/usePromise';

/**
 * LoadRmColor function takes an image URL and removes the white background.
 * @param {string} imageUrl - URL of the image with a white background.
 * @returns {Promise<HTMLCanvasElement> | false} - A Promise of HTMLCanvasElement or false.
 */
export const LoadRmColor = (params: TRmColorConfig & TSize): Promise<HTMLCanvasElement> | false => {
  const { width, height, url, color = '#ffffff00', tolerance = 25 } = params;
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
    canvas.width = width;
    canvas.height = height;

    // Draw the image onto the Canvas
    context.drawImage(image, 0, 0);

    // Get the pixel data of the image
    const imageData = context.getImageData(0, 0, width, height);
    const pixels = imageData.data;

    const whiteThreadshot = 255 - tolerance;

    // Convert the replaceColor to RGB format
    const replaceColorRGB = hexToRgba(color);

    // Iterate through the pixel data and make white pixels transparent
    for (let i = 0; i < pixels.length; i += 4) {
      const red = pixels[i];
      const green = pixels[i + 1];
      const blue = pixels[i + 2];

      // Check if the pixel is white based on the whiteThreadshot
      if (red > whiteThreadshot && green > whiteThreadshot && blue > whiteThreadshot) {
        // Replace the pixel with the specified color
        pixels[i] = replaceColorRGB.r;
        pixels[i + 1] = replaceColorRGB.g;
        pixels[i + 2] = replaceColorRGB.b;
        pixels[i + 3] = replaceColorRGB.a;
      }
    }

    // Put the modified image data back onto the Canvas
    context.putImageData(imageData, 0, 0);

    resolve(canvas);
  };

  return P;
};
