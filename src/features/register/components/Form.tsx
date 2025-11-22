"use client";

import React from 'react';
import { useRegisterForm } from '../hooks/useRegister';

const SignIn = ({ handleGoogleSignIn }: { handleGoogleSignIn: () => void }) => {
  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500 rounded-full">O regístrate con</span>
        </div>
      </div>
      
      <div className="mt-4">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          {/* SVG de Google */}
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>
      </div>
    </div>
  );
};


export default function RegisterForm() {
  const { 
    form,
    isRoleDropdownOpen,
    dropdownRef,
    roleDisplay,
    handleInputChange,
    handleRoleSelection,
    handleSubmit,
    handleGoogleSignIn,
    setIsRoleDropdownOpen,
  } = useRegisterForm();

  return (
    <div className="w-full md:w-full p-8 flex flex-col justify-center h-full max-w-lg mx-auto">
      <div className="ml-5 mb-8 text-center md:text-left">
        <h2 className="text-3xl font-bold text-gray-800">Crear Cuenta</h2>
        <p className="text-gray-600 mt-2">Regístrate para acceder a todas las funcionalidades</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        
        <div>
          <label htmlFor="name-input" className="ml-5 block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
          <input
            type="text" id="name-input" name="name" placeholder="Escribe tu nombre"
            value={form.name} onChange={handleInputChange} required
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-200"
          />
        </div>
        
        <div>
          <label htmlFor="email-input" className="ml-5 block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
          <input
            type="email" id="email-input" name="email" placeholder="tu@correo.com"
            value={form.email} onChange={handleInputChange} required
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-200"
          />
        </div>
        
        <div>
          <label htmlFor="password-input" className="ml-5 block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input
            type="password" id="password-input" name="password" placeholder="••••••••"
            value={form.password} onChange={handleInputChange} required
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-200"
          />
        </div>

        <div>
          <label htmlFor="role-select" className="ml-5 block text-sm font-medium text-gray-700 mb-1">Tipo de cuenta</label>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button" onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="w-full px-4 py-3 border border-gray-300 rounded-full hover:cursor-pointer bg-white text-left text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-200 flex justify-between items-center"
              aria-haspopup="true" aria-expanded={isRoleDropdownOpen}
            >
              {roleDisplay[form.role]} 
              <svg className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isRoleDropdownOpen ? 'rotate-180' : 'rotate-0'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>

            <div
              className={`
                absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded-xl shadow-lg z-20 overflow-hidden 
                transition-all duration-300 ease-out transform origin-top
                ${isRoleDropdownOpen ? 'opacity-100 scale-y-100 max-h-40' : 'opacity-0 scale-y-75 max-h-0'}
              `}
              role="menu" aria-orientation="vertical"
            >
              <button
                type="button" onClick={() => handleRoleSelection('User')}
                className="w-full text-left px-4 py-3 text-sm font-medium hover:cursor-pointer text-gray-700 hover:bg-sky-500 hover:text-white transition-colors duration-150"
                role="menuitem"
              >Usuario Común</button>
              <button
                type="button" onClick={() => handleRoleSelection('RealEstateAgency')}
                className="w-full text-left px-4 py-3 text-sm font-medium hover:cursor-pointer text-gray-700 hover:bg-sky-500 hover:text-white transition-colors duration-150"
                role="menuitem"
              >Inmobiliaria</button>
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-sky-500 text-white py-3 px-4 rounded-full font-semibold shadow-md hover:bg-sky-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 mt-6"
        >
          Registrarse
        </button>
      </form>
      <SignIn handleGoogleSignIn={handleGoogleSignIn} /> 
      <div className="mt-8 text-center text-sm text-gray-600">
        ¿Ya tienes una cuenta?
        <a href="/login" className="font-medium text-sky-500 hover:text-sky-700 ml-1">
          Inicia Sesión
        </a>
      </div>
    </div>
  );
}