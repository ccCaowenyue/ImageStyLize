import { TSize, TPixelConfig } from "../types/stylize.d";
import usePromise from "../utils/usePromise";

/**
 * LoadPixel function takes image parameters and returns a Promise of HTMLCanvasElement or false.
 * @param {TPixelConfig & TSize} params - Image parameters including URL and pixel size.
 * @returns {Promise<HTMLCanvasElement> | false} - A Promise of HTMLCanvasElement or false.
 */
export const LoadPixel = (
  params: TPixelConfig & TSize
): Promise<HTMLCanvasElement> | false => {
  const { url, avarage } = params;
  const [resolve, P] = usePromise<HTMLCanvasElement>();

  // Create a canvas element
  const canvas = document.createElement("canvas") as HTMLCanvasElement;
  const context = canvas.getContext("2d");

  if (!context) {
    return false;
  }

  // Create an Image object and load the image
  const image = new Image();
  image.src = url; // Replace with your image URL

  // Execute pixel style transformation after the image is loaded
  image.onload = () => {
    // Set the Canvas width and height to match the image
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw the image onto the Canvas
    context.drawImage(image, 0, 0, image.width, image.height);

    // Get the pixel data of the image
    const imageData = context.getImageData(0, 0, image.width, image.height);
    const pixels = imageData.data;

    // Apply pixel style
    for (let y = 0; y < image.height; y += avarage) {
      for (let x = 0; x < image.width; x += avarage) {
        const pixelIndex = (y * image.width + x) * 4;
        const r = pixels[pixelIndex];
        const g = pixels[pixelIndex + 1];
        const b = pixels[pixelIndex + 2];

        // Draw a rectangular block filled with pixel block color
        context.fillStyle = `rgb(${r},${g},${b})`;
        context.fillRect(x, y, avarage, avarage);
      }
    }

    // Draw the processed pixel data back onto the Canvas to apply the pixel style
    // context.putImageData(imageData, 0, 0);
    resolve(canvas);
  };

  return P;
};
