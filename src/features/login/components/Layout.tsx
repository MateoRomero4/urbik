import React from 'react';

const ImageSidebar = () => (
  <div
    className="hidden md:block md:w-3/5 lg:w-3/5 bg-cover bg-center h-full"
    style={{ backgroundImage: "url('/image.jpg')" }}
    role="img"
    aria-label="Fondo de imagen de Urbik"
  >
    <div className="h-full flex flex-col justify-between p-8 text-white">
      <div>
        <h1 className="text-4xl font-extrabold mb-3 shadow-text">Urbik</h1>
        <p className="text-xl font-light opacity-90 shadow-text">
          Crea tu cuenta y comienza a gestionar tus propiedades
        </p>
      </div>
      <div className="text-sm opacity-80 text-white">
        © 2025 Urbik. Todos los derechos reservados.
      </div>
    </div>
  </div>
);

interface RegisterLayoutProps {
  children: React.ReactNode;
}

export function LoginLayout({ children }: RegisterLayoutProps) {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 font-inter">
      <div className="flex w-full h-full overflow-hidden bg-white shadow-2xl">
        <ImageSidebar />
        {children}
      </div>
    </div>
  );
}