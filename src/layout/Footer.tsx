import React from "react";
import { Grid } from "@chakra-ui/react";
const Footer = () => {
  return (
    <Grid
      width="100%"
      p={1}
      pr={5}
      display="flex"
      alignItems="center"
      justifyContent="flex-end"
      style={{
        backgroundImage: "linear-gradient(to right top, #56CCF2, #2F80ED)",
      }}
    >
      <div style={{ fontWeight: 500 }}>Gerenciador Financeiro</div>
    </Grid>
  );
};

export default Footer;
