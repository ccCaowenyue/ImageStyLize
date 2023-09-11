export type TEffectType =
  | "blur"
  | "texty"
  | "grayscale"
  | "leca"
  | "pixel"
  | "oil"
  | "mixed"
  | "rmcolor"
  | "comic"
  | "ripple"
  | "noise";

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

/** Pixel init params */
export type TPixelConfig = {
  /** image url */
  url: string;
  /** blur radius */
  radius: number;
  /** pixel average */
  avarage: number;
};

/** Oil painting init params */
export type TOilPaintint = {
  /** image url */
  url: string;
  /** oil paintint radius */
  radius: number;
  /** oil paintint intensity */
  intensity: number;
};

/** Mixed init params */
export type TMixedConfig = {
  /** image url */
  url1: string;
  /** image url */
  url2: string;
};

/** RmColor init params */
export type TRmColorConfig = {
  /** image url */
  url: string;
  /** wait to replaced color(only accept hex color) */
  color: string;
  /** tolerance */
  tolerance: number;
};

/** Comic init params */
export type TComicConfig = {
  /** image url */
  url: string;
};

/** Ripple init params */
export type TRippleConfig = {
  /** image url */
  url: string;
  /** amplitude */
  amplitude: number;
  /** frequency */
  frequency: number;
};

/** Noise init params */
export type TNoiseConfig = {
  /** image url */
  url: string;
  /** intensity */
  intensity: number;
};

/** Effect init params */
export type TEffectConfig = {
  type: TEffectType;
  /** Gaussian blur init params */
  data:
    | TGaussianBlurConfig
    | TTextyConfig
    | TGrayScaleConfig
    | TLecaConfig
    | TPixelConfig
    | TOilPaintint
    | TMixedConfig
    | TRmColorConfig
    | TComicConfig
    | TRippleConfig
    | TNoiseConfig;
};
