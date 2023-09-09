import { TLecaConfig } from '../types/stylize';
import usePromise from '../utils/usePromise';

export const LoadLeca = (params: TLecaConfig): Promise<HTMLCanvasElement> | false => {
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

  // Apply the filter effect after the image is loaded
  image.onload = () => {
    // Set the Canvas width and height to match the image's dimensions
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw the image onto the Canvas
    context.drawImage(image, 0, 0, image.width, image.height);

    // Get the pixel data of the image
    const imageData = context.getImageData(0, 0, image.width, image.height);
    const pixels = imageData.data;

    // Iterate through the pixel data and apply the Leica camera filter effect
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      // Adjust color saturation, you can make adjustments as needed
      const saturation = 0.5;
      const gray = 0.2989 * r + 0.587 * g + 0.114 * b;
      const adjustedR = gray + saturation * (r - gray);
      const adjustedG = gray + saturation * (g - gray);
      const adjustedB = gray + saturation * (b - gray);

      // Adjust contrast, you can make adjustments as needed
      const contrast = 1.2;
      const finalR = (adjustedR - 128) * contrast + 128;
      const finalG = (adjustedG - 128) * contrast + 128;
      const finalB = (adjustedB - 128) * contrast + 128;

      // Apply the filter effect
      pixels[i] = finalR;
      pixels[i + 1] = finalG;
      pixels[i + 2] = finalB;
    }

    // Put the processed pixel data back onto the Canvas to display the filtered image
    context.putImageData(imageData, 0, 0);
    resolve(canvas);
  };

  return P;
};
