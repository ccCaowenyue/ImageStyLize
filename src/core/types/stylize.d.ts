export type TEffectType = 'blur' | 'texty' | 'grayscale' | 'leca';
/** Canvas init params */
export type TStylize = {
  width: number;
  height: number;
  container: HTMLElement | null;
};

export type TSize = {
  width: number;
  height: number;
};

/** Texty effect init params */
export type TTextyConfig = {
  /** image url */
  url: string;
  /** text */
  text: string;
  /** scale */
  scale: number;
  /** orderly */
  orderly: boolean;
};

/** Gaussian blur init params */
export type TGaussianBlurConfig = {
  /** image url */
  url: string;
  /** blur radius */
  radius: number;
};

/** Gray scale init params */
export type TGrayScaleConfig = {
  /** image url */
  url: string;
};

/** Gray scale init params */
export type TLecaConfig = {
  /** image url */
  url: string;
};

/** Effect init params */
export type TEffectConfig = {
  type: TEffectType;
  /** Gaussian blur init params */
  data: TGaussianBlurConfig | TTextyConfig | TGrayScaleConfig | TLecaConfig;
};
