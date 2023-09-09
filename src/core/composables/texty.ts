import { TSize, TTextyConfig } from '../types/stylize';
import usePromise from '../utils/usePromise';

/**
 * @description load texty effect
 * @param params
 * @returns Promise | false
 * @example
 * ```ts
 * const canvas = await LoadTexty({
 *  url: 'https://images.unsplash.com/photo-1622838013147-8b2b2b2b2b2b',
 *  text: '@%#*+=-:. ',
 *  scale: 10,
 *  orderly: false,
 * });
 * ```
 */
export const LoadTexty = (params: TTextyConfig & TSize): Promise<HTMLCanvasElement> | false => {
  const [resolve, P] = usePromise<HTMLCanvasElement>();
  const { url, text = '@%#*+=-:. ', scale = 10, orderly = false } = params;
  if (!url) {
    return false;
  }
  // get canvas context
  const canvas = document.createElement('canvas') as HTMLCanvasElement;
  const context = canvas.getContext('2d');

  if (!context) {
    return false;
  }

  // create image element
  const image = new Image();
  image.src = url; // replace with image path

  // calculate low resolution width and height
  const lowResWidth = Math.floor(params.width / scale); // low resolution width
  const lowResHeight = (params.height / params.width) * lowResWidth; // low resolution height

  // render image when it loads
  image.onload = () => {
    // set canvas size to low resolution

    // draw image to low resolution canvas
    context.drawImage(image, 0, 0, lowResWidth, lowResHeight);

    // get image data
    const imageData = context.getImageData(0, 0, lowResWidth, lowResHeight);
    const pixels = imageData.data;

    // set charSet to use for color values
    const charSet = text;

    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = params.width;
    canvas.height = params.height;
    let charsetIndex = 0;
    // walk through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel), and map each pixel to a character from our charSet
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      // calculate grayscale value
      const grayscale = (r + g + b) / 3;

      const x = (i / 4) % lowResWidth;
      const y = Math.floor(i / 4 / lowResWidth);

      if (orderly) {
        if (charsetIndex + 1 === charSet.length) {
          charsetIndex = 0;
        } else {
          charsetIndex += 1;
        }
      } else {
        charsetIndex = Math.floor((grayscale / 255) * (charSet.length - 1));
      }
      const char = charSet[charsetIndex];

      // start fill text at half the size of our low res pixel
      context.fillStyle = `rgb(${r}, ${g}, ${b})`;
      context.font = `${2 * scale}px monospace`;
      context.fillText(char, x * scale, y * scale);
    }
    resolve(canvas);
  };
  return P;
};
