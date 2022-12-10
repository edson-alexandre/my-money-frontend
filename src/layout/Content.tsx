import React from "react";
import { Grid } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/login/Login";

const Content = () => {
  return (
    <Grid width="100%" flex={1} p={3}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </Grid>
  );
};

export default Content;
