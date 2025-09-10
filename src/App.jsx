import React from "react";
import { Box } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TopMenu } from "./components/TopMenu";
import { FilmsPage } from "./pages/FilmsPage";
import { ActorsPage } from "./pages/ActorsPage";
import HomePage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";

export function App() {
  return (
    <BrowserRouter>
      <TopMenu />
      <Box sx={{mx: { xs: 1, md: 4 }, my: 4}}>
        <Routes>
          <Route path='/films' element={<FilmsPage />} />
          <Route path='/actors' element={<ActorsPage />} />
          <Route path='/' element={<HomePage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </Box>
    </BrowserRouter>
  )
}
