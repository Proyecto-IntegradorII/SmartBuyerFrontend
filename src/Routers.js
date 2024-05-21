// AppRouter.js
import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Search from './pages/Search'
export const AppRouter = () => {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Search/>} />
        </Routes>
      </BrowserRouter>
      
    );
  };