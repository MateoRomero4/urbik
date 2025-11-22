"use client";

import React, { useState } from 'react';

const PROPERTY_TYPES = ["CASA", "DEPARTAMENTO", "LOTE", "COMERCIO", "OFICINA"];
const OPERATION_TYPES = ["ALQUILER", "VENTA"];

const initialFormState = {
  title: '',
  description: '',
  address: '',
  city: '',
  province: '',
  country: '',
  type: PROPERTY_TYPES[0],
  price: '',
  area: '',
  rooms: '',
  bathrooms: '',
  operationType: OPERATION_TYPES[0],
  images: '',
};

interface PropertyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (propertyData: typeof initialFormState) => Promise<void>;
  isLoading: boolean;
}

const inputBaseClasses = 
  "p-3 w-full border border-gray-300 rounded-full transition duration-300 " +
  "focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 text-gray-900 shadow-sm";

const textareaBaseClasses = 
  "mt-1 p-3 w-full border border-gray-300 rounded-xl transition duration-300 " + 
  "focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 text-gray-900 shadow-sm";

interface FormChangeHandler {
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void;
}

const Input = ({ name, label, type = 'text', required = false, value, onChange }: { 
    name: keyof typeof initialFormState, 
    label: string, 
    type?: string, 
    required?: boolean, 
    value: string, 
    onChange: FormChangeHandler 
}) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-semibold mb-2 text-gray-800">
      {label}: {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={inputBaseClasses}
      required={required}
      placeholder={`Ingresa ${label.toLowerCase()}`}
    />
  </div>
);

const Select = ({ name, label, options, required = false, value, onChange }: { 
    name: keyof typeof initialFormState, 
    label: string, 
    options: string[], 
    required?: boolean, 
    value: string, 
    onChange: FormChangeHandler 
}) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-semibold mb-2 text-gray-800">
      {label}: {required && <span className="text-red-500">*</span>}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className={inputBaseClasses}
      required={required}
    >
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const PropertyFormModal: React.FC<PropertyFormModalProps> = ({ isOpen, onClose, onSave, isLoading }) => {
  const [form, setForm] = useState(initialFormState);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };
 
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto w-full max-w-3xl">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-b-2 border-sky-500/50 pb-4">
          Añadir Nueva Propiedad
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-gray-800">
          <Input 
            name="title" 
            label="Título de la Propiedad" 
            required 
            value={form.title} 
            onChange={handleChange} 
          />
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-semibold mb-2 text-gray-800">
              Descripción:
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className={textareaBaseClasses}
              placeholder="Describe tu propiedad con detalles..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select 
                name="operationType" 
                label="Tipo de Operación" 
                options={OPERATION_TYPES} 
                required 
                value={form.operationType} 
                onChange={handleChange} 
            />
            <Select 
                name="type" 
                label="Tipo de Propiedad" 
                options={PROPERTY_TYPES} 
                required 
                value={form.type} 
                onChange={handleChange} 
            />
          </div>
          <Input 
            name="price" 
            label="Precio ($)" 
            type="number" 
            required 
            value={form.price} 
            onChange={handleChange} 
          />
          <h3 className="text-xl font-bold mt-4 mb-2 text-gray-900">Ubicación</h3>
          <Input 
            name="country" 
            label="País" 
            required 
            value={form.country} 
            onChange={handleChange} 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
                name="province" 
                label="Provincia" 
                required 
                value={form.province} 
                onChange={handleChange} 
            />
            <Input 
                name="city" 
                label="Ciudad" 
                required 
                value={form.city} 
                onChange={handleChange} 
            />
          </div>
          <Input 
            name="address" 
            label="Dirección Completa" 
            required 
            value={form.address} 
            onChange={handleChange} 
          />
          <h3 className="text-xl font-bold mt-4 mb-2 text-gray-900">Detalles</h3>
          <div className="grid grid-cols-3 gap-4">
            <Input 
                name="area" 
                label="Superficie (m²)" 
                type="number" 
                value={form.area} 
                onChange={handleChange} 
            />
            <Input 
                name="rooms" 
                label="Habitaciones" 
                type="number" 
                value={form.rooms} 
                onChange={handleChange} 
            />
            <Input 
                name="bathrooms" 
                label="Baños" 
                type="number" 
                value={form.bathrooms} 
                onChange={handleChange} 
            />
          </div>
          <h3 className="text-xl font-bold mt-4 mb-2 text-gray-900">Imágenes</h3>
          <Input 
            name="images" 
            label="URLs de Imágenes (separadas por coma)" 
            value={form.images} 
            onChange={handleChange} 
          />
          
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 font-bold bg-red-500 text-white uppercase tracking-wider 
                        rounded-full transition-all duration-300 shadow-md 
                        border  hover:text-red-500 hover:border-2  hover:bg-white"
              disabled={isLoading}
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`
                px-6 py-3 font-extrabold text-white uppercase tracking-wider 
                rounded-full transition-all duration-300 shadow-lg 
                ${isLoading 
                  ? 'bg-sky-400 cursor-not-allowed shadow-inner' 
                  : 'bg-sky-500 hover:bg-white hover:text-sky-500 hover:border-2 hover:border-sky-500 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-sky-300'
                }
              `}
            >
              {isLoading ? 'GUARDANDO...' : 'GUARDAR PROPIEDAD'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyFormModal;