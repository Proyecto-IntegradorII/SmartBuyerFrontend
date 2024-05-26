// AppRouter.js
import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Search from './pages/Search'
import AudioRecorder from './pages/audio'
export const AppRouter = () => {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Search/>} />
          <Route path="/s" element={<AudioRecorder/>} />
        </Routes>
      </BrowserRouter>
      
    );
  };