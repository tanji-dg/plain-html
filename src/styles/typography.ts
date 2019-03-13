import { css } from 'styled-components';

const weights = {
  thin: 100,
  light: 300,
  normal: 'normal',
  medium: 500,
  bold: 'bold',
  black: 900,
};

const sizes = {
  small: '0.85em',
  medium: '1em',
  large: '1.25em',
  xlarge: '1.5em',
  xxlarge: '3em',
};

const styles = {
  italic: 'italic',
  normal: 'normal',
};

const fonts = {
  standard: css`
    font-family: 'Styrene B', Verdana, sans-serif;
    font-weight: ${weights.normal};
    font-size: ${sizes.medium};
  `,
};

export default {
  fonts,
  sizes,
  styles,
  weights,
};
