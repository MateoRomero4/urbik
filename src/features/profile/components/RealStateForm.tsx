import React from 'react';

interface RealStateFormModel {
    name: string;
    address: string;
    phone: string;
    website: string;
}

interface RealStateFormProps {
    form: RealStateFormModel;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    loading: boolean;
}

const RealStateForm: React.FC<RealStateFormProps> = ({ form, handleChange, handleSubmit, loading }) => {

    const inputBaseClasses = 
        "p-3 w-full border border-gray-300 rounded-full transition duration-300 " +
        "focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 text-gray-900 shadow-sm";

    const readOnlyInputClasses = 
        `${inputBaseClasses} bg-gray-100 cursor-not-allowed border-dashed`;

    const buttonBaseClasses = `
        mt-4 px-6 py-3 font-extrabold text-white uppercase tracking-wider 
        rounded-full transition-all duration-300 shadow-lg 
        ${loading 
            ? 'bg-sky-400 cursor-not-allowed shadow-inner' 
            : 'bg-sky-500 hover:bg-sky-600 hover:bg-white hover:text-sky-500 hover:border-2 hover:border-sky-500 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-sky-300'
        }
    `;

    return (
        <div className="p-8 md:p-10 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl mx-auto w-full h-fit border-2 border-sky-100 dark:border-sky-700">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 border-b-2 border-sky-500/50 pb-4">
                Editar Información de Agencia
            </h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-gray-800 dark:text-gray-200">
                <div>
                    <label htmlFor="name" className="block text-sm font-semibold mb-2">
                        Nombre de la Agencia:
                    </label>
                    <input 
                        id="name"
                        name="name" 
                        type="text"
                        value={form.name} 
                        onChange={handleChange} 
                        className={`${inputBaseClasses} dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                        placeholder="Ingresa el nombre de tu agencia"
                        required 
                    />
                </div>

                <div>
                    <label htmlFor="address" className="block text-sm font-semibold mb-2">
                        Dirección de la Oficina:
                    </label>
                    <input 
                        id="address"
                        name="address" 
                        type="text"
                        value={form.address} 
                        onChange={handleChange} 
                        className={`${inputBaseClasses} dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                        placeholder="Calle, número, ciudad..."
                    />
                </div>
                
                <div>
                    <label htmlFor="phone" className="block text-sm font-semibold mb-2">
                        Teléfono:
                    </label>
                    <input 
                        id="phone"
                        name="phone" 
                        type="tel"
                        value={form.phone} 
                        onChange={handleChange} 
                        className={`${inputBaseClasses} dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                        placeholder="Ingresa el teléfono de contacto"
                    />
                </div>

                <div>
                    <label htmlFor="website" className="block text-sm font-semibold mb-2">
                        Sitio Web:
                    </label>
                    <input 
                        id="website"
                        name="website" 
                        type="url"
                        value={form.website} 
                        onChange={handleChange} 
                        className={`${inputBaseClasses} dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                        placeholder="https://www.tuagencia.com"
                    />
                </div>
                
                <button
                    type="submit"
                    disabled={loading}
                    className={buttonBaseClasses}
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            GUARDANDO...
                        </span>
                    ) : "GUARDAR CAMBIOS"}
                </button>
            </form>
        </div>
    );
};

export default RealStateForm;