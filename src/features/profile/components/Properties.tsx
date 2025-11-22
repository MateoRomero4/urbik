import { useState } from 'react';
import PropertyFormModal from "./PropertyFormModal";
import { PropertyFormDataType } from "../../../libs/types";

interface Property {
  id: number;
  title: string;
  address: string;
  isAvailable: boolean;
}

interface PropertiesProps {
  userRole: 'USER' | 'REALSTATE' | null;
  userProperties: Property[];
  fetchUserData: () => Promise<void>;
  setMessage: (message: string) => void;
}

const handleSaveProperty = async (propertyData: PropertyFormDataType, setMessage: (msg: string) => void) => {
  const imagesArray = propertyData.images.split(',').map(url => url.trim()).filter(url => url.length > 0);

  try {
    const res = await fetch("/api/property", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...propertyData, images: imagesArray })
    });

    const data = await res.json();

    if (res.ok) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
};


export default function Properties({ userRole, userProperties, fetchUserData, setMessage }: PropertiesProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPropertySaving, setIsPropertySaving] = useState(false);

  const handleSave = async (propertyData: PropertyFormDataType) => {
    setIsPropertySaving(true);
    setMessage("");

    const success = await handleSaveProperty(propertyData, setMessage);

    if (success) {
      setIsModalOpen(false);
      await fetchUserData();
    }
    
    setIsPropertySaving(false);
  };

  const PropertyList = ({ properties }: { properties: Property[] }) => (
    <div className="mt-6">

      {userRole === 'REALSTATE' && (
        <button
          className="font-sans font-bold bg-green-500 text-white px-6 py-3 rounded-full mb-6 hover:bg-green-600 transition-colors shadow-lg flex items-center justify-center text-lg"
          onClick={() => setIsModalOpen(true)}
        >
          + Agregar Propiedad 
        </button>
      )}

      {properties.length === 0 ? (
        <p className="text-gray-600 p-6 border border-gray-200 rounded-xl bg-gray-50 text-center shadow-inner">
          Aún no tienes propiedades publicadas. <span className="font-semibold text-sky-600">¡Empieza a agregar!</span>
        </p>
      ) : (
        <ul className="space-y-4">
          {properties.map((p) => (
            <li 
              key={p.id} 
              className="border border-gray-200 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white shadow-md transition-all hover:shadow-lg hover:border-sky-300"
            >
              <div className="flex flex-col mb-3 sm:mb-0 sm:mr-4 flex-grow">
                <span className="text-gray-900 font-sans font-extrabold text-lg truncate">
                  {p.title || "Sin Título"}
                </span>
                <span className="text-gray-500 text-sm font-light italic mt-1 truncate">
                  {p.address || "Dirección no especificada"}
                </span>
                
                <span className={`mt-2 w-max text-xs font-bold px-3 py-1 rounded-full ${p.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {p.isAvailable ? 'DISPONIBLE' : 'INACTIVA'}
                </span>
              </div>
              
              <div className="flex space-x-4 flex-shrink-0">
                <button 
                  className="text-sky-600 font-semibold hover:text-sky-800 transition-colors text-sm py-2 px-3 border border-sky-600 rounded-lg hover:bg-sky-50"
                >
                  Editar
                </button>
                <button 
                  className="text-red-600 font-semibold hover:text-red-800 transition-colors text-sm py-2 px-3 border border-red-600 rounded-lg hover:bg-red-50"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );


  return (
    <div className="p-6 md:p-8 bg-white rounded-xl shadow-2xl max-w-3xl mx-auto w-full">
        
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b-2 border-sky-500 pb-3 text-center">
        Publicaciones de la Agencia 🏠
      </h2>
      
      <PropertyList properties={userProperties} />
      
      {userRole === 'REALSTATE' && (
        <PropertyFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
          onSave={handleSave}
          isLoading={isPropertySaving}
        />
      )}
    </div>
  );
}