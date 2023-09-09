import { TGaussianBlurConfig, TSize } from '../types/stylize';
import usePromise from '../utils/usePromise';

const mulTable = [
  512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360,
  335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360,
  347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328, 320,
  312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360,
  354, 347, 341, 335, 329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461,
  454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328, 324, 320,
  316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470,
  465, 460, 456, 451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381, 377, 374, 370, 367, 363, 360,
  357, 354, 350, 347, 344, 341, 338, 335, 332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292, 289, 287, 285,
  282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259,
];

const shgTable = [
  9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19,
  19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21,
  21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
  22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
  23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
  23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
  24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
  24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
];

/**
 * @class
 * @description BlurStack
 * @property {Integer} r
 * @property {Integer} g
 * @property {Integer} b
 * @property {Integer} a
 * @property {BlurStack} next
 * @returns {BlurStack}
 * @example
 * const stack = new BlurStack();
 */
export class BlurStack {
  r: number;
  g: number;
  b: number;
  a: number;
  next: null;
  /**
   * Set properties.
   */
  constructor() {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;
    this.next = null;
  }
}
/**
 * @param {ImageData} imageData
 * @param {Integer} topX
 * @param {Integer} topY
 * @param {Integer} width
 * @param {Integer} height
 * @param {Float} radius
 * @returns {ImageData}
 */
const processImageDataRGB = (
  imageData: ImageData,
  topX: number,
  topY: number,
  width: number,
  height: number,
  radius: number
): ImageData => {
  const pixels = imageData.data;

  const div = 2 * radius + 1;
  // const w4 = width << 2;
  const widthMinus1 = width - 1;
  const heightMinus1 = height - 1;
  const radiusPlus1 = radius + 1;
  const sumFactor = (radiusPlus1 * (radiusPlus1 + 1)) / 2;

  const stackStart = new BlurStack();
  let stack = stackStart;
  let stackEnd;
  for (let i = 1; i < div; i++) {
    // @ts-ignore
    stack = stack.next = new BlurStack();
    if (i === radiusPlus1) {
      stackEnd = stack;
    }
  }
  // @ts-ignore
  stack.next = stackStart;
  let stackIn = null;
  let stackOut = null;

  const mulSum = mulTable[radius];
  const shgSum = shgTable[radius];

  let p, rbs;
  let yw = 0,
    yi = 0;

  for (let y = 0; y < height; y++) {
    let pr = pixels[yi],
      pg = pixels[yi + 1],
      pb = pixels[yi + 2],
      rOutSum = radiusPlus1 * pr,
      gOutSum = radiusPlus1 * pg,
      bOutSum = radiusPlus1 * pb,
      rSum = sumFactor * pr,
      gSum = sumFactor * pg,
      bSum = sumFactor * pb;

    stack = stackStart;

    for (let i = 0; i < radiusPlus1; i++) {
      stack.r = pr;
      stack.g = pg;
      stack.b = pb;
      // @ts-ignore
      stack = stack.next;
    }

    let rInSum = 0,
      gInSum = 0,
      bInSum = 0;
    for (let i = 1; i < radiusPlus1; i++) {
      p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
      rSum += (stack.r = pr = pixels[p]) * (rbs = radiusPlus1 - i);
      gSum += (stack.g = pg = pixels[p + 1]) * rbs;
      bSum += (stack.b = pb = pixels[p + 2]) * rbs;

      rInSum += pr;
      gInSum += pg;
      bInSum += pb;
      // @ts-ignore
      stack = stack.next;
    }

    stackIn = stackStart;

    stackOut = stackEnd;
    for (let x = 0; x < width; x++) {
      pixels[yi] = (rSum * mulSum) >> shgSum;
      pixels[yi + 1] = (gSum * mulSum) >> shgSum;
      pixels[yi + 2] = (bSum * mulSum) >> shgSum;

      rSum -= rOutSum;
      gSum -= gOutSum;
      bSum -= bOutSum;

      rOutSum -= stackIn!.r;
      gOutSum -= stackIn!.g;
      bOutSum -= stackIn!.b;

      p = (yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1)) << 2;

      rInSum += stackIn!.r = pixels[p];
      gInSum += stackIn!.g = pixels[p + 1];
      bInSum += stackIn!.b = pixels[p + 2];

      rSum += rInSum;
      gSum += gInSum;
      bSum += bInSum;

      stackIn = stackIn!.next;

      rOutSum += pr = stackOut!.r;
      gOutSum += pg = stackOut!.g;
      bOutSum += pb = stackOut!.b;

      rInSum -= pr;
      gInSum -= pg;
      bInSum -= pb;

      stackOut = stackOut!.next;

      yi += 4;
    }
    yw += width;
  }

  for (let x = 0; x < width; x++) {
    yi = x << 2;
    let pr = pixels[yi],
      pg = pixels[yi + 1],
      pb = pixels[yi + 2],
      rOutSum = radiusPlus1 * pr,
      gOutSum = radiusPlus1 * pg,
      bOutSum = radiusPlus1 * pb,
      rSum = sumFactor * pr,
      gSum = sumFactor * pg,
      bSum = sumFactor * pb;

    stack = stackStart;

    for (let i = 0; i < radiusPlus1; i++) {
      stack.r = pr;
      stack.g = pg;
      stack.b = pb;
      // @ts-ignore
      stack = stack.next;
    }

    let rInSum = 0,
      gInSum = 0,
      bInSum = 0;
    for (let i = 1, yp = width; i <= radius; i++) {
      yi = (yp + x) << 2;

      rSum += (stack.r = pr = pixels[yi]) * (rbs = radiusPlus1 - i);
      gSum += (stack.g = pg = pixels[yi + 1]) * rbs;
      bSum += (stack.b = pb = pixels[yi + 2]) * rbs;

      rInSum += pr;
      gInSum += pg;
      bInSum += pb;

      // @ts-ignore
      stack = stack.next;

      if (i < heightMinus1) {
        yp += width;
      }
    }

    yi = x;
    stackIn = stackStart;
    stackOut = stackEnd;
    for (let y = 0; y < height; y++) {
      p = yi << 2;
      pixels[p] = (rSum * mulSum) >> shgSum;
      pixels[p + 1] = (gSum * mulSum) >> shgSum;
      pixels[p + 2] = (bSum * mulSum) >> shgSum;

      rSum -= rOutSum;
      gSum -= gOutSum;
      bSum -= bOutSum;

      rOutSum -= stackIn!.r;
      gOutSum -= stackIn!.g;
      bOutSum -= stackIn!.b;

      p = (x + ((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width) << 2;

      rSum += rInSum += stackIn!.r = pixels[p];
      gSum += gInSum += stackIn!.g = pixels[p + 1];
      bSum += bInSum += stackIn!.b = pixels[p + 2];

      stackIn = stackIn!.next;

      rOutSum += pr = stackOut!.r;
      gOutSum += pg = stackOut!.g;
      bOutSum += pb = stackOut!.b;

      rInSum -= pr;
      gInSum -= pg;
      bInSum -= pb;

      stackOut = stackOut!.next;

      yi += width;
    }
  }

  return imageData;
};

/**
 * @param {string|HTMLCanvasElement} canvas
 * @param {Integer} topX
 * @param {Integer} topY
 * @param {Integer} width
 * @param {Integer} height
 * @throws {Error|TypeError}
 * @returns {ImageData} See {@link https://html.spec.whatwg.org/multipage/canvas.html#imagedata}
 */
const getImageDataFromCanvas = (
  canvas: string | HTMLCanvasElement,
  topX: number,
  topY: number,
  width: number,
  height: number
): ImageData | undefined => {
  if (typeof canvas === 'string') {
    canvas = document.getElementById(canvas) as HTMLCanvasElement;
  }
  if (!canvas || typeof canvas !== 'object' || !('getContext' in canvas)) {
    throw new TypeError('Expecting canvas with `getContext` method ' + 'in processCanvasRGB(A) calls!');
  }

  const context = canvas.getContext('2d');

  try {
    return context?.getImageData(topX, topY, width, height);
  } catch (e) {
    throw new Error('unable to access image data: ' + e);
  }
};

/**
 * @param {HTMLCanvasElement} canvas
 * @param {Integer} topX
 * @param {Integer} topY
 * @param {Integer} width
 * @param {Integer} height
 * @param {Float} radius
 * @returns {undefined}
 */
const processCanvasRGB = (
  canvas: HTMLCanvasElement,
  topX: number,
  topY: number,
  width: number,
  height: number,
  radius: number
): undefined => {
  if (isNaN(radius) || radius < 1) {
    return;
  }
  radius |= 0;

  let imageData = getImageDataFromCanvas(canvas, topX, topY, width, height);
  if (!imageData) {
    return;
  }
  imageData = processImageDataRGB(imageData, topX, topY, width, height, radius);

  canvas.getContext('2d')?.putImageData(imageData, topX, topY);
};

/**
 * load gaussian blur
 * @param {string} img
 * @returns {undefined}
 */
export const LoadGaussianBlur = async (params: TGaussianBlurConfig & TSize): Promise<HTMLCanvasElement> => {
  const [resolve, P] = usePromise<HTMLCanvasElement>();
  const { url, radius } = params;

  const inputImage = new Image();
  inputImage.src = url;

  inputImage.onload = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = inputImage.width;
    canvas.height = inputImage.height;
    context?.drawImage(inputImage, 0, 0, params.width, params.height);
    // deal with image data
    processCanvasRGB(canvas, 0, 0, params.width, params.height, radius);
    resolve(canvas);
  };
  return P;
};
