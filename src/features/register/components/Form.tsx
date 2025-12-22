"use client";

import Link from "next/link";
import { useRegisterForm } from "../hooks/useRegister";

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export default function RegisterForm() {
  const {
    form,
    handleInputChange,
    handleSubmit,
    handleGoogleSignIn,
    handleRoleSelection, // lo usamos para “¿Sos una inmobiliaria?”
  } = useRegisterForm();

  const isAgency =
    form.role === "RealEstateAgency" ||
    form.role === "REALSTATE" ||
    form.role === "REALSTATE_AGENCY";

  return (
    <div className="w-full justify-center items-center">
      {/* Marca arriba a la derecha (como boceto) */}
      <div className="flex items-baseline justify-between">
        <div className="flex flex-col">
          <h2 className="text-3xl font-display font-bold mb-2">
            {isAgency ? "Registar tu inmobiliaria" : "Registarte"}
          </h2>
          <p className="text-gray-500 mb-8 text-sm">
            Ingresa tus credenciales para crear tu cuenta
          </p>
        </div>
        <h1 className="text-4xl lg:text-7xl font-brand font-black text-right  ">
          Urbik
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isAgency ? (
          <>
            <div>
              <label className="block text-xs font-medium mb-2">
                Nombre completo
              </label>
              <input
                name="name"
                placeholder="example"
                value={form.name}
                onChange={handleInputChange}
                className="w-full rounded-full px-5 py-3 text-sm outline-none bg-gradient-to-r from-gray-100 via-gray-100 to-white focus:ring-2 focus:ring-black/20"
              />
            </div>

            {/* Campo visual (no rompe tu hook) */}
            <div>
              <label className="block text-xs font-medium mb-2">Apellido</label>
              <input
                placeholder="example"
                className="w-full rounded-full px-5 py-3 text-sm outline-none bg-gradient-to-r from-gray-100 via-gray-100 to-white focus:ring-2 focus:ring-black/20"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-2">
                Correo electrónico
              </label>
              <input
                name="email"
                placeholder="example@example.com"
                value={form.email}
                onChange={handleInputChange}
                className="w-full rounded-full px-5 py-3 text-sm outline-none bg-gradient-to-r from-gray-100 via-gray-100 to-white focus:ring-2 focus:ring-black/20"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                placeholder="********"
                value={form.password}
                onChange={handleInputChange}
                className="w-full rounded-full px-5 py-3 text-sm outline-none bg-gradient-to-r from-gray-100 via-gray-100 to-white focus:ring-2 focus:ring-black/20"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="radio"
                  className="w-4 h-4 rounded-full border-gray-300 text-black focus:ring-black"
                />
                Recordarme
              </label>

              <button
                type="button"
                className="text-sm text-cyan-400 font-medium hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => handleRoleSelection("RealEstateAgency")}
                className="text-sm text-cyan-400 font-medium hover:underline"
              >
                ¿Sos una inmobiliaria?
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Agency UI calcada (visual) */}
            <div>
              <label className="block text-xs font-medium mb-2">
                Nombre de la inmobiliaria
              </label>
              <input
                placeholder="example"
                className="w-full rounded-full px-5 py-3 text-sm outline-none bg-gradient-to-r from-gray-100 via-gray-100 to-white focus:ring-2 focus:ring-black/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-2">
                  Matrícula
                </label>
                <input
                  placeholder="xxxxxxxxxx"
                  className="w-full rounded-full px-5 py-3 text-sm outline-none bg-gradient-to-r from-gray-100 via-gray-100 to-white focus:ring-2 focus:ring-black/20"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2">
                  Numero de teléfono
                </label>
                <input
                  placeholder="12345678"
                  className="w-full rounded-full px-5 py-3 text-sm outline-none bg-gradient-to-r from-gray-100 via-gray-100 to-white focus:ring-2 focus:ring-black/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium mb-2">
                  Provincia
                </label>
                <input
                  placeholder="Buenos Aires"
                  className="w-full rounded-full px-5 py-3 text-sm outline-none bg-gradient-to-r from-gray-100 via-gray-100 to-white focus:ring-2 focus:ring-black/20"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2">Calle</label>
                <input
                  placeholder="example"
                  className="w-full rounded-full px-5 py-3 text-sm outline-none bg-gradient-to-r from-gray-100 via-gray-100 to-white focus:ring-2 focus:ring-black/20"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2">Numero</label>
                <input
                  placeholder="xxxx"
                  className="w-full rounded-full px-5 py-3 text-sm outline-none bg-gradient-to-r from-gray-100 via-gray-100 to-white focus:ring-2 focus:ring-black/20"
                />
              </div>
            </div>

            {/* Estos 2 sí conectados al hook (para que funcione el registro real) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-2">
                  Correo electrónico
                </label>
                <input
                  name="email"
                  placeholder="example@example.com"
                  value={form.email}
                  onChange={handleInputChange}
                  className="w-full rounded-full px-5 py-3 text-sm outline-none bg-gradient-to-r from-gray-100 via-gray-100 to-white focus:ring-2 focus:ring-black/20"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="********"
                  value={form.password}
                  onChange={handleInputChange}
                  className="w-full rounded-full px-5 py-3 text-sm outline-none bg-gradient-to-r from-gray-100 via-gray-100 to-white focus:ring-2 focus:ring-black/20"
                />
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-[#00F0FF] text-white font-medium py-3 rounded-full text-lg shadow-sm hover:opacity-90 transition-opacity mt-6"
        >
          Registrarme
        </button>
      </form>

      {/* En boceto: Google solo para no-agency */}
      {!isAgency && (
        <>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                o continuá con
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full bg-gradient-to-r from-[#3E3E3E] via-black to-[#2E2E2E] text-white font-medium py-3 rounded-full text-md shadow-sm hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
          >
            <GoogleIcon />
            Google
          </button>
        </>
      )}

      <div className="text-center mt-8 text-sm">
        ¿Ya tienes una cuenta?{" "}
        <Link
          href="/login"
          className="text-cyan-400 font-medium hover:underline"
        >
          Ingresar
        </Link>
      </div>
    </div>
  );
}
