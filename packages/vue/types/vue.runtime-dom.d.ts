import { CSSProperties as RawCSSProperties } from '@vue/runtime-dom';

declare module '@vue/runtime-dom' {
  export interface CSSProperties extends RawCSSProperties {
    [key: `--${string}`]: any;
  }
}
