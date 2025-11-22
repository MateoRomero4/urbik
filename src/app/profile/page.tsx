"use client";

import { useSession, signIn } from "next-auth/react";
import { 
  UserFormFields, 
  RealStateFormFields 
} from "../../libs/types"; 
import { useProfile } from "../../features/profile/hooks/useProfile"; 
import UserForm from "../../features/profile/components/UserForm"; 
import RealStateForm from "../../features/profile/components/RealStateForm"; 
import Properties from "../../features/profile/components/Properties"; 


export default function Profile() {
  const { status } = useSession();
  
  const {
    userRole,
    form,
    userProperties,
    loading,
    message,
    refetchData, 
    handleChange,
    handleSubmit,
  } = useProfile(); 

  if (status === "loading" || userRole === null) return <p>Cargando sesión y perfil...</p>;
  
  if (status === "unauthenticated")
    return (
      <div className="p-8">
        <p>No estás autenticado.</p>
        <button 
          onClick={() => signIn()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Iniciar sesión
        </button>
      </div>
    );

  return (
    <div className="w-full mx-auto mt-40 p-4 bg-transparent">
      
      {message && (
        <p 
          className="mb-4 p-3 bg-blue-100 border-l-4 border-blue-500 text-blue-700"
        >
          {message}
        </p>
      )}

      {userRole === 'REALSTATE' ? (
        <div className="flex flex-col lg:flex-row gap-8 items-start h-fit">
          
          <div className="w-full lg:w-1/2">
            <RealStateForm 
              form={form as RealStateFormFields & { auth_provider: string }} 
              handleChange={handleChange} 
              handleSubmit={handleSubmit} 
              loading={loading} 
            />
          </div>
          
          <div className="w-full lg:w-1/2">
            <Properties 
              userRole={userRole} 
              userProperties={userProperties} 
              fetchUserData={refetchData}
              setMessage={() => {}}
            />
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <UserForm 
            form={form as UserFormFields & { auth_provider: string }} 
            handleChange={handleChange} 
            handleSubmit={handleSubmit} 
            loading={loading} 
          />
        </div>
      )}
    </div>
  );
}