"use client"
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react'; 

import Image from 'next/image'; 
import { SearchBar } from '../../features/search/components/SearchBar'; 

function Navbar() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
    const dropdownRef = useRef(null); 

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !(dropdownRef.current as HTMLElement).contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);


    if (status === "loading") {

        return (
<nav className='fixed top-0 w-full max-w-4xl z-1050 bg-transparent py-4 left-1/2 transform -translate-x-1/2'> 
<div className='max-w-7xl mx-auto mt-6 flex items-center justify-between px-8 text-white py-4 rounded-2xl border-black/20'>
    <Link href="/">
        <h1 className='text-xl text-white font-sans font-extrabold'>Urbik</h1>
    </Link>
    <div className='flex items-center gap-4'>
        <div className='h-8 w-20 bg-gray-500/30 rounded-full animate-pulse'></div>
    </div>
</div>
</nav>
        );
    }

    return (

<nav className='fixed top-0 w-full max-w-4xl z-1050 bg-transparent py-4 left-1/2 transform -translate-x-1/2'>
    <div className='bg-black backdrop-blur-md mx-auto flex items-center justify-between px-8 text-white py-4 rounded-full border border-white/10 shadow-2xl transition-all duration-300 max-w-7xl'>
        
        <Link href="/" className='shrink-0'>
            <h1 className='text-xl font-bold text-white'>Urbik</h1>
        </Link>


        <div className='flex-1 flex justify-center mx-6 hidden md:flex'> 
            <div className='relative max-w-xl w-full'>
                <SearchBar />
            </div>
        </div>

        <div className='flex items-center space-x-4 ml-6 mr-4 hidden lg:flex'>
            
            <Link href="/lang/es" className='flex items-center text-sm font-semibold text-white hover:text-white/70 transition-colors duration-200'>
                <Image 
                    src="/languageicon.svg" 
                    alt="Idioma" 
                    width={20} 
                    height={20} 
                    className='mr-1'
                />
                ES
            </Link>

            <Link href="/ayuda" className='text-sm font-semibold text-white hover:text-white/70 transition-colors duration-200'>
                Ayuda
            </Link>

            <Link href="/quienes-somos" className='text-sm font-semibold text-white hover:text-white/70 transition-colors duration-200'>
                Quiénes somos
            </Link>

        </div>

        <div className='relative shrink-0' ref={dropdownRef}>
            <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className='font-sans font-extrabold text-black bg-white hover:bg-white/20 hover:cursor-pointer hover:text-white px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2'
            >
                {session ? (
                    <>
                        Mi Perfil
                        <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </>
                ) : (
                    "Ingresar"
                )}
            </button>

            <div 
                className={`
                    absolute right-0 mt-2 w-48 bg-black rounded-lg shadow-xl py-0 z-1020  overflow-hidden
                    transition-all duration-300 ease-out 
                    ${isDropdownOpen ? 'max-h-60' : 'max-h-0'}
                    ${!isDropdownOpen ? 'hidden' : ''}
                `}
            > 
                {session ? (
                    <>
                        <Link href="/profile" onClick={() => setIsDropdownOpen(false)} className='font-sans font-bold block px-4 py-2 text-sm text-white hover:bg-white/10 hover:text-white transition-colors duration-150'>
                            Mi Perfil
                        </Link>
                        <Link href="/settings" onClick={() => setIsDropdownOpen(false)} className='font-sans font-bold block px-4 py-2 text-sm text-white hover:bg-white/10 hover:text-white transition-colors duration-150'>
                            Configuración
                        </Link>
                        <hr className='border-gray-700/80 my-1' />
                        <button 
                            onClick={() => {
                                signOut();
                                setIsDropdownOpen(false);
                            }}
                            className='border-0 font-sans font-bold w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 hover:text-red-500 transition-colors duration-150'
                        >
                            Cerrar Sesión
                        </button>
                    </>
                ) : (
                    <>
                        <button 
                            onClick={() => {
                                router.push('/login');
                                setIsDropdownOpen(false);
                            }}
                            className='w-full text-left px-4 py-2 text-sm text-white hover:cursor-pointer hover:bg-white/10 transition-colors duration-150 font-sans font-bold'
                        >
                            Iniciar Sesión
                        </button>
                        <button 
                            onClick={() => {
                                router.push('/register');
                                setIsDropdownOpen(false);
                            }}
                            className='w-full text-left px-4 py-2 text-sm text-white hover:cursor-pointer hover:bg-white/10 transition-colors duration-150 font-sans font-bold'
                        >
                            Registrarse
                        </button>
                    </>
                )}
            </div>
        </div>
    </div>
</nav>
    );
}

export default Navbar;