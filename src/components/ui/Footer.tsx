import { Box, Text } from "theme-ui"
import { Link } from "components/ui/Link"

const Footer: React.FC = () => (
  <Box
    sx={{
      p: 4,
      color: "#666",
      textAlign: "center",
      fontSize: 1,
    }}
  >
    <Text sx={{ mx: 3, display: "inline-block" }}>
      ©{new Date().getFullYear()} DSA National Tech Committee
    </Text>
    <Text sx={{ mx: 3, display: "inline-block" }}>
      <Link external href="https://dsausa.org/join">
        Join DSA
      </Link>
    </Text>
  </Box>
)

export default Footer
