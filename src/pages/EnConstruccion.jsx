// src/components/Banner6GW.jsx
import React from 'react';

export default function EnConstruccion() {
  return (
    <div className='h-screen flex justify-center'>
      <div className=" rounded-2xl flex flex-col overflow-hidden mb-6 mt-6 bg-surface-primary p-5 border border-[color:var(--border-default)] shadow self-center">
        <h3 className='text-[30px] text-[#ffc800]'>En construcción!</h3>
        <p className='text-[20px] pt-3'>Esta sección está en construcción. Estamos trabajando para ofrecerte la mejor experiencia.</p>
        <p className='text-[20px] pt-3'>Pronto estará disponible!</p>
      </div>
    </div>
  );
}
