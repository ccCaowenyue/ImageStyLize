import { TMixedConfig, TSize } from '../types/stylize';
import usePromise from '../utils/usePromise';

/**
 * LoadMixed function takes mixed configuration parameters and returns a Promise of HTMLCanvasElement or false.
 * @param {TMixedConfig & TSize} params - Mixed configuration parameters including canvas size and URLs of two images for blending.
 * @returns {Promise<HTMLCanvasElement> | false} - A Promise of HTMLCanvasElement or false.
 */
export const LoadMixed = (params: TMixedConfig & TSize): Promise<HTMLCanvasElement> | false => {
  const { width, height, url1, url2 } = params;

  if (!url1 || !url2) {
    return false;
  }

  // Create a Canvas to store the merged image
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  const canvas2 = document.createElement('canvas');
  const context2 = canvas2.getContext('2d');
  if (!context || !context2) {
    return false;
  }

  const [resolve, P] = usePromise<HTMLCanvasElement>();

  // Get the pixel data of the first image
  const image1 = new Image();
  image1.src = url1; // Replace with the URL of the first image

  image1.onload = () => {
    // Set the Canvas width and height to match the first image
    canvas.width = width;
    canvas.height = height;

    // Draw the first image onto the Canvas
    context.drawImage(image1, 0, 0, width, height);

    // Get the pixel data of the second image
    const image2 = new Image();
    image2.src = url2; // Replace with the URL of the second image

    image2.onload = () => {
      canvas2.width = width;
      canvas2.height = height;
      // Draw the second image onto the Canvas, you can adjust the position and size for different effects
      context2.drawImage(image2, 0, 0, width, height);

      // Get the pixel data of the merged image
      const mergedImageData = context2.getImageData(0, 0, width, height);
      for (var i = 0, len = mergedImageData.data.length; i < len; i += 4) {
        // Adjust the transparency of each pixel
        mergedImageData.data[i + 3] = mergedImageData.data[i + 3] * 0.9;
      }

      // Draw the merged image data back onto the Canvas
      context2.putImageData(mergedImageData, 0, 0);
      context.drawImage(canvas2, 0, 0, width, height);

      resolve(canvas);
    };
  };

  return P;
};
