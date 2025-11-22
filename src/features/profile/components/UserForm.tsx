import React from 'react';

const UserForm = ({ form, handleChange, handleSubmit, loading }) => {
  const inputBaseClasses = 
    "p-3 w-full border border-gray-300 rounded-full transition duration-300 " +
    "focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 text-gray-900 shadow-sm";

  return (
    <div className="p-8 md:p-10 bg-transparent rounded-3xl shadow-2xl max-w-2xl mx-auto w-full h-full">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-b-2 border-sky-500/50 pb-4">
        Editar Información de Perfil
      </h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-gray-800">
        
        
        {['Nombre', 'Apellido', 'Teléfono'].map((label, index) => {
            const name = label === 'Nombre' ? 'firstName' : label === 'Apellido' ? 'lastName' : 'phone';
            return (
                <div key={index}>
                    <label htmlFor={name} className="block text-sm font-semibold mb-2">
                        {label}:
                    </label>
                    <input 
                        id={name}
                        name={name} 
                        value={form[name]} 
                        onChange={handleChange} 
                        className={inputBaseClasses}
                        required={name !== 'phone'}
                        placeholder={`Ingresa tu ${label.toLowerCase()}`}
                    />
                </div>
            )
        })}
        
        <button
          type="submit"
          disabled={loading}
          className={`
            mt-4 px-6 py-3 font-extrabold text-white uppercase tracking-wider 
            rounded-full transition-all duration-300 shadow-lg 
            ${loading 
              ? 'bg-sky-400 cursor-not-allowed shadow-inner' 
              : 'bg-sky-500 hover:bg-white hover:text-sky-500 hover:border-2 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-sky-300'
            }
          `}
        >
          {loading ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
        </button>
      </form>
    </div>
  );
};

const App = () => {
    const [formData, setFormData] = React.useState({
        firstName: 'Elena',
        lastName: 'Martínez',
        phone: '123-456-7890',
        auth_provider: 'Google', 
    });
    const [isLoading, setIsLoading] = React.useState(false);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        console.log('Intentando guardar datos:', formData);
        
        setTimeout(() => {
            setIsLoading(false);
            console.log('¡Cambios guardados!');
        }, 1500);
    };

    return (
        <div className="min-h-screen flex  justify-center p-4 sm:p-6 font-sans">
            <UserForm 
                form={formData} 
                handleChange={handleChange} 
                handleSubmit={handleSubmit} 
                loading={isLoading}
            />
        </div>
    );
}

export default App;
