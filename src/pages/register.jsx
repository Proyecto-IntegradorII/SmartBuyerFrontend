import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../conections/requests";
import HomeButton from "../utilities/HomeButton";
import Swal from "sweetalert2";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", username: "", contrasena: "" });
  const [confirmedPassword, setConfirmedPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const lowercaseEmail = formData.email.toLowerCase();

    if (formData.contrasena.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Contraseña demasiado corta",
        customClass: { container: "font-text" },
      });
      return;
    }

    if (formData.contrasena !== confirmedPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Las contraseñas no son las mismas",
        customClass: { container: "font-text" },
      });
      return;
    }

    if (formData.username.length < 5) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El nombre de usuario no es válido",
        customClass: { container: "font-text" },
      });
      return;
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El correo no es válido",
        customClass: { container: "font-text" },
      });
      return;
    }

    const req_succesful = await postData({ ...formData, email: lowercaseEmail });

    if (req_succesful === "Data submitted successfully") {
      Swal.fire({
        title: "Congrats!",
        text: "Haz sido registrado!",
        icon: "success",
        customClass: { container: "font-text" },
      });
      navigate("/login");
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Perdón, algunos servicios no están disponibles",
        customClass: { container: "font-text" },
      });
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
          <h2 className="text-2xl font-bold text-center mb-8">Registro</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Nombre de usuario"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <input
              type="email"
              placeholder="Correo"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
            />
            <input
              type="password"
              placeholder="Repite contraseña"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setConfirmedPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition duration-300"
            >
              Registrarme
            </button>
          </form>
          <div className="text-center mt-5">
            <button
              className="underline"
              onClick={() => navigate("/login")}
            >
              ¿Ya tienes una cuenta?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
