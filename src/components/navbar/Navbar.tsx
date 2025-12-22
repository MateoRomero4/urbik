"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { SearchBar } from "../../features/search/components/SearchBar";

function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return (
      <nav className="bg-urbik-black text-urbik-white py-4 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="shrink-0">
            <h1 className="text-2xl font-brand font-medium tracking-tight">
              Urbik
            </h1>
          </Link>

          <div className="flex items-center gap-6">
            <div className="h-9 w-44 bg-white/10 rounded-full animate-pulse" />
            <div className="h-9 w-28 bg-white/10 rounded-full animate-pulse" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-urbik-black text-urbik-white py-4 px-6 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        {/* Left: Brand + Search (solo si hay sesión) */}
        <div className="flex items-center gap-8">
          <Link href="/" className="shrink-0">
            <h1 className="text-2xl font-brand font-medium tracking-tight">
              Urbik
            </h1>
          </Link>

          {session && (
            <div className="hidden md:flex relative w-[26rem] bg-urbik-g200 rounded-full overflow-hidden">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-urbik-muted" />
              </div>

              {/* Mantengo tu SearchBar (funcionalidad) */}
              <div className="w-full pl-10 pr-4 py-2">
                <SearchBar />
              </div>
            </div>
          )}
        </div>

        {/* Center: Links (como boceto) */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className="text-urbik-white hover:opacity-80 transition"
          >
            Inicio
          </Link>

          {session && (
            <Link
              href="/dashboard"
              className="text-white/60 hover:text-urbik-white transition"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Right: Help/About + Auth button */}
        <div className="flex items-center gap-6 text-sm">
          <Link
            href="/ayuda"
            className="text-white/60 hover:text-urbik-white transition"
          >
            Ayuda
          </Link>

          <Link
            href="/quienes-somos"
            className="text-white/60 hover:text-urbik-white transition"
          >
            Acerca de
          </Link>

          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen((v) => !v)}
              className="bg-urbik-g300 text-urbik-black px-5 py-2 rounded-full font-medium hover:bg-urbik-white transition flex items-center gap-2"
            >
              {session ? "Mi Perfil" : "Ingresar"}
              <svg
                className={`w-4 h-4 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown (negro, como boceto) */}
            <div
              className={[
                "absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl bg-urbik-black border border-white/10 shadow-2xl",
                "transition-all duration-200",
                isDropdownOpen
                  ? "opacity-100 translate-y-0"
                  : "pointer-events-none opacity-0 -translate-y-2",
              ].join(" ")}
            >
              {session ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-5 py-3 text-sm font-medium text-urbik-white hover:bg-white/10 transition"
                  >
                    Mi Perfil
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-5 py-3 text-sm font-medium text-urbik-white hover:bg-white/10 transition"
                  >
                    Configuración
                  </Link>

                  <div className="h-px bg-white/10" />

                  <button
                    onClick={() => {
                      signOut();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-5 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 transition"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      router.push("/login");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-5 py-3 text-sm font-medium text-urbik-white hover:bg-white/10 transition"
                  >
                    Iniciar Sesión
                  </button>

                  <button
                    onClick={() => {
                      router.push("/register");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-5 py-3 text-sm font-medium text-urbik-white hover:bg-white/10 transition"
                  >
                    Registrarse
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
