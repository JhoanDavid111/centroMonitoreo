import React from 'react';
import { useAuth } from '../context/AuthForm';
import logo from '../assets/logosEnergiaUpme.svg';

export default function LoginForm() {
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value.trim();
    const password = e.target.password.value.trim();
    login(username, password); // Llama a la función del contexto
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#262626] font-sans">
      <div className="bg-[#1d1d1d] p-8 rounded shadow-md w-full max-w-sm text-white">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo Energía UPME" className="h-16" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            type="text"
            placeholder="Usuario"
            required
            className="w-full px-4 py-2 rounded bg-[#333] text-white placeholder-gray-400"
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            required
            className="w-full px-4 py-2 rounded bg-[#333] text-white placeholder-gray-400"
          />
          <button
            type="submit"
            className="w-full bg-[#FFC800] hover:bg-[#e6b000] text-black font-semibold py-2 rounded"
          >
            Continuar
          </button>
        </form>
      </div>
    </div>
  );
}