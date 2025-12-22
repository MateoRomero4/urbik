import React from "react";

const ImageSidebar = () => (
  <div className="hidden lg:block w-3/5 relative overflow-hidden">
    <img
      src="/image2.jpg"
      alt="Auth Background"
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-black/5" />
    <div className="absolute bottom-8 left-8 text-white text-xs font-medium z-10 drop-shadow-md">
      © 2025 Urbik. Todos los derechos reservados.
    </div>
  </div>
);

export function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen justify-center bg-white pt-17">
      <ImageSidebar />
      <div className="w-full lg:w-2/5 flex items-center justify-center p-12">
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
