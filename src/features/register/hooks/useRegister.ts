import { useState, useRef, useEffect } from "react";

type Role = 'User' | 'RealEstateAgency';
interface RegistrationForm {
  name: string;
  email: string;
  password: string;
  role: Role;
}

const navigateTo = (path: string) => {
  console.log(`Simulando redirección a: ${path}`);
  window.location.href = path;
};

const roleDisplay = {
  'User': 'Usuario Común',
  'RealEstateAgency': 'Inmobiliaria'
};

export function useRegisterForm() {
  const [form, setForm] = useState<RegistrationForm>({
    name: "",
    email: "",
    password: "",
    role: "User",
  });
  
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };
  
  const handleRoleSelection = (role: Role) => {
    handleInputChange({ 
        target: { name: 'role', value: role } 
    } as React.ChangeEvent<HTMLSelectElement>);
    setIsRoleDropdownOpen(false);
  };
  
  const handleGoogleSignIn = () => {
    navigateTo("/"); 
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.role) {
      alert("Por favor, selecciona un tipo de cuenta.");
      return; 
    }

    try {
      const res = await fetch("/api/register", { 
        method: "POST", 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(form) 
      });

      if (res.ok) {
        navigateTo("/");
      } else {
        const data = await res.json();
        const errorMessage = data.error || data.message || "Error desconocido al registrar.";
        alert(`Error al registrar: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error de red o parsing:", error);
      alert("Error de conexión. Inténtalo de nuevo.");
    }
  };

  return {
    form,
    isRoleDropdownOpen,
    dropdownRef,
    roleDisplay,
    handleInputChange,
    handleRoleSelection,
    handleSubmit,
    handleGoogleSignIn,
    setIsRoleDropdownOpen,
  };
}