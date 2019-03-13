import { lighten, transparentize } from 'polished';

const palette = {
  black: '#241f20',
  gray: {
    light: '#f6f6f6',
    medium: '#e4e4e8',
    dark: '#747380',
  },
  white: '#fff',
  red: {
    dark: '#9f0005',
    medium: '#e70109',
    light: '#ffe2d6',
  },
};

const theme = {
  bg: palette.white,
  text: palette.black,
  link: palette.gray.dark,
  notification: lighten(0.25, palette.red.medium),
  primary: palette.red.medium,
  overlay: transparentize(0.5, palette.black),
};

export default { palette, theme };
