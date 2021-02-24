/** @jsxImportSource theme-ui */
import config from "../../../blog.config"
import { MDXProvider } from "@mdx-js/react"
import { Box, Heading } from "theme-ui"
import Blurb from "mdx/blurb.mdx"
import Nav from "./Nav"

const Header: React.FC = () => (
  <MDXProvider>
    <Box as="header" sx={{ textAlign: "center", pt: 5 }}>
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
      <Heading sx={{ fontSize: 6, pb: 2, px: 3 }} as="h1">
        {config.title}
      </Heading>
      <Heading sx={{ pb: 3, px: [3, 4] }}>{config.subtitle}</Heading>
      <Box sx={{ pb: 3 }}>
        <Blurb />
      </Box>
      <Nav />
    </Box>
  </MDXProvider>
)

export default Header
