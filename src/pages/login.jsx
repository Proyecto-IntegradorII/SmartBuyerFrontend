import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postLogin, postLoginGoogle } from "../conections/requests";
import Swal from "sweetalert2";
import HomeButton from "../utilities/HomeButton";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", contrasena: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const lowercaseEmail = formData.email.toLowerCase();
    const req_succesful = await postLogin({ ...formData, email: lowercaseEmail });

    if (req_succesful === "Inicio de sesión exitoso") {
      Swal.fire({
        title: "Welcome!",
        text: "Inicio de sesión exitoso!",
        icon: "success",
        customClass: { container: "font-text" },
      });
      navigate("/login/search");
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: req_succesful,
        customClass: { container: "font-text" },
      });
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    const req_succesful = await postLoginGoogle({ credentialResponse });

    if (req_succesful === "Inicio de sesión exitoso") {
      Swal.fire({
        title: "Welcome!",
        text: "Inicio de sesión exitoso!",
        icon: "success",
        customClass: { container: "font-text" },
      });
      navigate("/login/search");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-text">
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl w-full">
        {/* Left Section - Image */}
        <div className="hidden md:block md:w-2/3">
          <img
            src={require("../media/logos/logo.jpg")}
            alt="Background"
            className="object-cover w-full h-full"
          />
        </div>
        {/* Right Section - Form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="flex justify-end">
          <HomeButton />
          </div>
          <h2 className="text-2xl font-bold text-center mb-8">Inicio de sesión</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              id="email"
              type="email"
              placeholder="Correo"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              id="password"
              type="password"
              placeholder="Contraseña"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
            />
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition duration-300"
            >
              Inicio de sesión
            </button>
          </form>
          <div className="text-center mt-5">
            <button
              className="underline"
              onClick={() => navigate("/register")}
            >
              ¿No tienes una cuenta?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
