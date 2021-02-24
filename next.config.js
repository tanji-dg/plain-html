const withImages = require("next-images")
const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
})
module.exports = withImages(
  withMDX({
    env: {
      SITE_URL:
        process.env.NODE_ENV === "production"
          ? "https://tech.dsausa.org"
          : "http://localhost:3000",
    },
    pageExtensions: ["js", "jsx", "md", "mdx", "tsx"],
    webpack: (config, { isServer }) => {
      // Fixes npm packages (mdx) that depend on `fs` module
      if (!isServer) {
        config.node = {
          fs: "empty",
        }
      }
      return config
    },
  })
)
