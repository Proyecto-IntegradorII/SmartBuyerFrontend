// AppRouter.js
import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Search from "./pages/Search";
import SearchL from "./pages/SearchLogin";
import SendText from "./chatGPT";
import Login from "./pages/login";
import Register from "./pages/register";
export const AppRouter = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={localStorage.getItem("token") ? <SearchL /> : <Search />} />
				<Route path="/login/search" element={<SearchL />} />
				<Route path="/gpt" element={<SendText />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
			</Routes>
		</BrowserRouter>
	);
};
