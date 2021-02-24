import { Theme as ThemeType } from "theme-ui"
// theme-ui polaris preset
export const theme: ThemeType = {
  initialColorModeName: "Light",
  useColorSchemeMediaQuery: true,
  space: [0, 4, 8, 16, 32, 64, 128],
  breakpoints: ["512px", "768px", "1024px", "1280px"],
  radii: [0, 3, 6],
  shadows: {
    card: "0 0 4px rgba(0, 0, 0, .125)",
    sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    outline: "0 0 0 3px rgba(66, 153, 225, 0.6)",
    inner: "inset 0 2px 4px 0 rgba(0,0,0,0.06)",
    none: "none",
  },
  fonts: {
    body:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    heading:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    monospace: "Menlo, monospace",
  },
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 96],
  fontWeights: {
    body: 400,
    heading: 600,
    bold: 700,
  },
  lineHeights: {
    body: 1.75,
    heading: 1.25,
  },
  // These are the default color names, but you can use your own or even nest them,
  // eg `red { light: "#xx1", med: "#xx2", dark: "#xx3" }, referenced as sx={{color: "red.med"}}
  /** 
    .Reds-1-hex { color: #690003; }
    .Reds-2-hex { color: #EC474C; }
    .Reds-3-hex { color: #E70109; }
    .Reds-4-hex { color: #691F22; }
    .Reds-5-hex { color: #B50006; }

    .Reds-1-rgba { color: rgba(105, 0, 3, 1); }
    .Reds-2-rgba { color: rgba(236, 71, 76, 1); }
    .Reds-3-rgba { color: rgba(231, 1, 9, 1); }
    .Reds-4-rgba { color: rgba(105, 31, 34, 1); }
    .Reds-5-rgba { color: rgba(181, 0, 6, 1); }
   * 
   */
  colors: {
    background: "#fff",
    text: "#323232",
    primary: "#B50006",
    secondary: "#17a2b8",
    accent: "#E70109",
    highlight: "#EC474C",
    muted: "#f6f6f6",
    modes: {
      dark: {
        background: "#1b1e21",
        primary: "#EC474C",
        secondary: "#17a2b8",
        text: "#fff",
        muted: "#333",
        accent: "#E70109",
      },
    },
  },
  text: {
    heading: {
      fontFamily: "heading",
      fontWeight: "heading",
      lineHeight: "heading",
    },
    highlight: {
      bg: "highlight",
    },
  },
  buttons: {
    primary: {
      bg: "primary",
      borderStyle: "solid",
      borderColor: "primary",
      borderRadius: 2,
      borderWidth: 2,
      boxShadow: "none",
      color: "white",
      cursor: "pointer",
      fontSize: 3,
      px: 3,
      py: 2,
      "&:hover": {
        transition: "background-color .25s ease-in, border-color .25s ease-in",
        background: "#E70109",
        borderColor: "#E70109",
      },
    },
    secondary: {
      bg: "secondary",
      borderStyle: "solid",
      borderColor: "secondary",
      borderRadius: 2,
      borderWidth: 2,
      boxShadow: "none",
      color: "white",
      cursor: "pointer",
      fontSize: 3,
      px: 3,
      py: 2,
    },
    outline: {
      bg: "background",
      borderStyle: "solid",
      borderColor: "primary",
      color: "primary",
      borderWidth: 2,
      borderRadius: 2,
      boxShadow: "none",
      cursor: "pointer",
      fontSize: 3,
      px: 3,
      py: 2,
      mono: {
        bg: "background",
        borderStyle: "solid",
        borderColor: "text",
        color: "text",
        borderWidth: 2,
        borderRadius: 2,
        boxShadow: "none",
        cursor: "pointer",
        fontSize: 3,
        px: 3,
        py: 2,
      },
    },
  },
  styles: {
    root: {
      fontFamily: "body",
      lineHeight: "body",
      fontWeight: "body",
      // added only to demo the highlight text
      "*": {
        "::selection": {
          bg: "highlight",
          color: "text",
        },
      },
    },
    h1: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      fontSize: 5,
    },
    h2: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      fontSize: 4,
    },
    h3: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      fontSize: 3,
    },
    h4: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      fontSize: 2,
    },
    h5: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      fontSize: 1,
    },
    h6: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      fontSize: 0,
    },
    p: {
      color: "text",
      fontFamily: "body",
      fontWeight: "body",
      lineHeight: "body",
      code: {
        background: "black",
        color: "accent",
        borderRadius: 1,
        px: 1,
        fontFamily: "monospace",
        fontSize: "inherit",
      },
    },
    a: {
      color: "primary",
      cursor: "pointer",
    },
    pre: {
      fontFamily: "monospace",
      overflowX: "auto",
      code: {
        color: "inherit",
      },
    },
    code: {
      background: "black",
      color: "accent",
      borderRadius: 1,
      px: 1,
      fontFamily: "monospace",
      fontSize: "inherit",
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: 0,
    },
    th: {
      textAlign: "left",
      borderBottomStyle: "solid",
    },
    td: {
      textAlign: "left",
      borderBottomStyle: "solid",
    },
    img: {
      maxWidth: "100%",
    },
  },
}
