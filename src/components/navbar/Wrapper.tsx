"use client";

import { usePathname } from 'next/navigation';
import Navbar from './Navbar'; 

const excludedPaths: string[] = ['/login', '/register'];

export default function NavbarWrapper(): JSX.Element | null {
  const pathname: string | null = usePathname();

  if (!pathname) {
      return null;
  }
  
  const isExcluded: boolean = excludedPaths.includes(pathname);

  if (isExcluded) {
    return null;
  }

  return <Navbar />;
}