import { TOilPaintint, TPixelConfig, TSize } from "../types/stylize.d";
import usePromise from "../utils/usePromise";

/**
 * LoadOilPainting function takes pixel and size parameters and returns a Promise of HTMLCanvasElement or false.
 * @param {TPixelConfig & TSize} params - Pixel and size parameters including URL, pixel size, and canvas size.
 * @returns {Promise<HTMLCanvasElement> | false} - A Promise of HTMLCanvasElement or false.
 */
export const LoadOilPainting = (
  params: TOilPaintint & TSize
): Promise<HTMLCanvasElement> | false => {
  const [resolve, P] = usePromise<HTMLCanvasElement>();

  const { url, radius = 4, intensity = 255, width, height } = params;

  // Create a canvas element
  const canvas = document.createElement("canvas") as HTMLCanvasElement;
  const context = canvas.getContext("2d");

  if (!context) {
    return false;
  }

  // Create an Image object and load the image
  const image = new Image();
  image.src = url; // Replace with your image URL

  // Execute oil painting style transformation after the image is loaded
  image.onload = () => {
    canvas.width = width;
    canvas.height = height;
    context.drawImage(image, 0, 0, width, height);
    let imgData = context.getImageData(0, 0, width, height),
      pixData = imgData.data,
      pixelIntensityCount = [];

    // for demo purposes, remove this to modify the original canvas

    let destImageData = context.createImageData(width, height),
      destPixData = destImageData.data,
      intensityLUT: Array<Array<number>> = [],
      rgbLUT: Array<
        Array<{
          r: number;
          g: number;
          b: number;
        }>
      > = [];

    for (let y = 0; y < height; y++) {
      intensityLUT[y] = [];
      rgbLUT[y] = [];
      for (let x = 0; x < width; x++) {
        let idx = (y * width + x) * 4,
          r = pixData[idx],
          g = pixData[idx + 1],
          b = pixData[idx + 2],
          avg = (r + g + b) / 3;

        intensityLUT[y][x] = Math.round((avg * intensity) / 255);
        rgbLUT[y][x] = {
          r: r,
          g: g,
          b: b,
        };
      }
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        pixelIntensityCount = [];

        // Find intensities of nearest pixels within radius.
        for (let yy = -radius; yy <= radius; yy++) {
          for (let xx = -radius; xx <= radius; xx++) {
            if (y + yy > 0 && y + yy < height && x + xx > 0 && x + xx < width) {
              let intensityVal = intensityLUT[y + yy][x + xx];

              if (!pixelIntensityCount[intensityVal]) {
                pixelIntensityCount[intensityVal] = {
                  val: 1,
                  r: rgbLUT[y + yy][x + xx].r,
                  g: rgbLUT[y + yy][x + xx].g,
                  b: rgbLUT[y + yy][x + xx].b,
                };
              } else {
                pixelIntensityCount[intensityVal].val++;
                pixelIntensityCount[intensityVal].r += rgbLUT[y + yy][x + xx].r;
                pixelIntensityCount[intensityVal].g += rgbLUT[y + yy][x + xx].g;
                pixelIntensityCount[intensityVal].b += rgbLUT[y + yy][x + xx].b;
              }
            }
          }
        }

        pixelIntensityCount.sort(function (a, b) {
          return b.val - a.val;
        });

        let curMax = pixelIntensityCount[0].val,
          dIdx = (y * width + x) * 4;

        destPixData[dIdx] = ~~(pixelIntensityCount[0].r / curMax);
        destPixData[dIdx + 1] = ~~(pixelIntensityCount[0].g / curMax);
        destPixData[dIdx + 2] = ~~(pixelIntensityCount[0].b / curMax);
        destPixData[dIdx + 3] = 255;
      }
    }

    // change this to ctx to instead put the data on the original canvas
    context.putImageData(destImageData, 0, 0);
    resolve(canvas);
  };

  return P;
};
