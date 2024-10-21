import { extendTheme } from "@chakra-ui/react";

let theme = extendTheme({
  config: {
    initialColorMode: "#1a202c", // Ensures dark mode is the default
    useSystemColorMode: false // Ignores system color mode preference
  }
});

export default theme;
