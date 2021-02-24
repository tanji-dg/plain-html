/** @jsxImportSource theme-ui */
import React from "react"
import config from "../../../blog.config"
import { Box } from "theme-ui"

interface Props {
  theme: string
}

const Logo: React.FC<Props> = () => {
  return (
    <Box
      sx={{
        mt: 2,
        mb: 3,
        width: "100%",
      }}
    >
      <img
        sx={{
          border: "1px solid",
          borderColor: "rgba(0,0,0,.1)",
          width: "25vh",
          height: "25vh",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
        src={config.shareImage}
        alt={config.shareImageAlt}
      />
    </Box>
  )
}

export default Logo

// Theme image example from MyDSA

// const Container = styled.span<
//   { fontSize: number; transform: string },
//   AppTheme
// >(
//   ({ fontSize, transform, theme }) => `
//   font-size: ${get(theme, "fontSizes." + fontSize)};
//   display: inline-flex;
//   align-self: center;

//   svg {
//     font-size: ${get(theme, "fontSizes." + fontSize)};
//     fill: currentcolor;
//     transform: ${transform};
//   }
// `
// )

// interface Props {
//   title: string
//   d: string
//   color?: string
//   fontSize?: number
//   transform?: string
//   width?: number
//   height?: number
// }

// export const Icon: React.FC<Props> = ({
//   title,
//   d,
//   color = "currentcolor",
//   fontSize = 1,
//   transform = "none",
//   width = 32,
//   height = 32,
//   ...rest
// }): JSX.Element => (
//   <Container fontSize={fontSize} transform={transform} {...rest}>
//     <svg
//       version="1.1"
//       xmlns="http://www.w3.org/2000/svg"
//       width={width}
//       height={height}
//       viewBox={`0 0 ${width} ${height}`}
//     >
//       <title>{title}</title>
//       <path fill={color} d={d} />
//     </svg>
//   </Container>
// )

// export default Icon
