import * as React from "react";
import { ChakraProvider, Grid, theme } from "@chakra-ui/react";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Content from "./layout/Content";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Grid
      display="flex"
      flexDirection="column"
      height="100vh"
      fontFamily="roboto"
    >
      <Header />
      <Content />
      <Footer />
    </Grid>
  </ChakraProvider>
);
