import { createGlobalStyle } from 'styled-components';

import { colors, typography } from '../styles';

const GlobalStyles = createGlobalStyle`
  html {
    ${typography.fonts.standard};
    background-color: ${colors.palette.gray.light};
    color: ${colors.theme.text};

    body {
      margin: 0 auto;
      max-width: 860px;
    }
  }
`;

export default GlobalStyles;
