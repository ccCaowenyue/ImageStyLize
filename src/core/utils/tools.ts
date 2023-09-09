/**
 * init canvas
 * @param width
 * @param height
 * @param container
 * @param canvas
 * @private
 * @description init canvas
 * 1. create canvas
 * 2. set canvas width and height
 * 3. append canvas to container
 * 4. return canvas
 * @returns HTMLCanvasElement
 */
export const createCanvas = (width: number, height: number, container: HTMLElement): HTMLCanvasElement => {
  const _canvas = document.createElement('canvas');
  _canvas.width = width;
  _canvas.height = height;
  container.appendChild(_canvas);
  _canvas.width = width;
  _canvas.height = height;
  return _canvas;
};
/**
 * load image
 * @param imageUrl
 * @description load image
 * 1. create image
 * 2. set image src
 * 3. return Promise
 * @returns Promise
 */
export const loadImage = (imageUrl: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      resolve(image);
    };
    image.onerror = (error) => {
      reject(error);
    };
  });
};
