import { TEffectType, TGaussianBlurConfig, TGrayScaleConfig, TLecaConfig, TSize, TTextyConfig } from '../types/stylize';
import { LoadGaussianBlur } from './blur';
import { LoadTexty } from './texty';
import { LoadGrayscale } from './grayscale';
import { LoadLeca } from './leca';

export const EffectMap: Record<TEffectType, Function> = {
  blur: LoadGaussianBlur,
  texty: LoadTexty,
  grayscale: LoadGrayscale,
  leca: LoadLeca,
};

/**
 * load effect
 * @param effect
 * @description load effect
 */
export const loadEffect = async (effect: {
  type: TEffectType;
  data: (TGaussianBlurConfig | TTextyConfig | TGrayScaleConfig | TLecaConfig) & TSize;
}): Promise<HTMLCanvasElement | false> => {
  const type = effect.type;
  if (!effect.data || !type || !EffectMap[type]) {
    return false;
  }

  const canvas = await EffectMap[type]({ ...effect.data });
  return canvas;
};
