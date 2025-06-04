// src/components/AuthFormScreen.jsx
import React from 'react';
import LoginForm from './LoginForm';
import TwoFactorForm from './TwoFactorForm';
import { useAuth } from '../context/AuthForm';

export default function AuthFormScreen() {
  const { step, user, login, verifyCode } = useAuth();

  return (
    <div className="min-h-screen bg-[#262626] flex items-center justify-center">
      {step === 'login' && <LoginForm onSubmit={login} />}
      {step === '2fa' && <TwoFactorForm user={user} onVerify={verifyCode} />}
    </div>
  );
}