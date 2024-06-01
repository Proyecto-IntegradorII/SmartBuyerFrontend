// AppRouter.js
import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Search from './pages/Search'
import SearchL from './pages/SearchLogin'
import SendText from "./chatGPT";
export const AppRouter = () => {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Search/>} />
          <Route path="/login/search" element={<SearchL/>} />
          <Route path="/gpt" element={<SendText/>} />
        </Routes>
      </BrowserRouter>
      
    );
  };