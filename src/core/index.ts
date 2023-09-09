import { EffectMap, loadEffect } from './composables';
import { LoadTexty } from './composables/texty';
import { TEffectConfig, TStylize } from './types/stylize';
import { createCanvas, loadImage } from './utils/tools';

/**
 * @description Core module
 * entry file, export all modules
 */
export class Stylize {
  private _canvas: HTMLCanvasElement | null = null;

  /**
   * get canvas context
   * @private
   * @returns CanvasRenderingContext2D | null
   * @description get canvas context
   */
  private get _ctx(): CanvasRenderingContext2D | null {
    return this._canvas?.getContext('2d') || null;
  }

  constructor(params: TStylize) {
    this.init(params);
  }
  /**
   * init
   * @param params
   */
  private init(params: TStylize): void {
    const { width, height, container } = params;
    if (!container) {
      console.error('[Stylize Error]: container is not defined');
      return;
    }
    this.initCanvas(width, height, container);
  }
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
  private initCanvas(width: number, height: number, container: HTMLElement): HTMLCanvasElement {
    this._canvas = createCanvas(width, height, container);
    return this._canvas;
  }

  public async draw(effect: TEffectConfig) {
    const canvas = await loadEffect({
      type: effect.type,
      data: {
        ...effect.data,
        width: this._canvas?.width || 0,
        height: this._canvas?.height || 0,
      },
    });
    if (!canvas || !this._canvas) {
      return;
    }
    this._ctx?.drawImage(canvas, 0, 0);
  }
}
