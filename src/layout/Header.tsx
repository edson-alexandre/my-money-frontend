import React, { useContext } from "react";
import { Box, Grid } from "@chakra-ui/react";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import UserContext from "../context/user/UserContext";
const Header = () => {
  const { state } = useContext(UserContext);

  return (
    <Grid
      width="100%"
      px={3}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      style={{
        backgroundImage: "linear-gradient(to right top, #56CCF2, #2F80ED)",
      }}
    >
      <Box
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        flex={1}
      >
        {!state.logged || (
          <>
            <i
              className="bi bi-emoji-smile-fill"
              style={{
                color: "yellow",
                fontSize: "2em",
              }}
            />
            <Box>
              <span
                style={{ fontWeight: 900, fontSize: "1.2em", marginLeft: 20 }}
              >
                Olá {state.name}!
              </span>{" "}
            </Box>
          </>
        )}
      </Box>
      <Box fontSize="1.7em" fontWeight={900} display="flex">
        My Money
      </Box>
      <Box display="flex" flex={1} justifyContent="flex-end">
        <ColorModeSwitcher />
      </Box>
    </Grid>
  );
};

export default Header;
