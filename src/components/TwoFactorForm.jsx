import React, { useState } from 'react';
import { useAuth } from '../context/AuthForm';

export function TwoFactorForm() {
  const { verifyCode } = useAuth();
  const [code, setCode] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    verifyCode(code);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1d1d1d] text-white">
      <form onSubmit={handleSubmit} className="bg-[#262626] p-8 rounded shadow-lg space-y-4 w-80">
        <h2 className="text-xl font-bold">Verificación 2FA</h2>
        <input type="text" placeholder="Código de verificación" className="w-full p-2 bg-gray-800 border border-gray-600 rounded" value={code} onChange={e => setCode(e.target.value)} />
        <button type="submit" className="w-full bg-[#FFC800] hover:bg-yellow-400 text-black p-2 rounded font-bold">Verificar</button>
      </form>
    </div>
  );
}