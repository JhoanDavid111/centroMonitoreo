import React, { useState } from 'react';
import { useAuth } from '../context/AuthForm';

export function LoginForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1d1d1d] text-white">
      <form onSubmit={handleSubmit} className="bg-[#262626] p-8 rounded shadow-lg space-y-4 w-80">
        <h2 className="text-xl font-bold">Iniciar sesión</h2>
        <input type="text" placeholder="Usuario" className="w-full p-2 bg-gray-800 border border-gray-600 rounded" value={username} onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Contraseña" className="w-full p-2 bg-gray-800 border border-gray-600 rounded" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit" className="w-full bg-[#FFC800] hover:bg-yellow-400 text-black p-2 rounded font-bold">Continuar</button>
      </form>
    </div>
  );
}