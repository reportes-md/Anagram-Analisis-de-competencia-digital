import React, { useState } from 'react';

interface InputFormProps {
  onAnalyze: (brand: string, category: string, country: string, competitors: string) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onAnalyze, isLoading }) => {
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [country, setCountry] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !category || !country) {
      setError('Todos los campos son obligatorios (excepto competidores).');
      return;
    }
    setError('');
    onAnalyze(brand, category, country, competitors);
  };

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 p-6 sm:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-brand-primary mb-4 font-display">Ingresa datos para análisis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="brand" className="block text-sm font-bold text-gray-800 mb-2">
              Marca
            </label>
            <input
              type="text"
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Ej. Coca-Cola"
              className="w-full px-5 py-3 bg-white text-brand-text-dark border border-gray-200 rounded-[2rem] shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-150 ease-in-out"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-bold text-gray-800 mb-2">
              Categoría
            </label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ej. Refrescos"
              className="w-full px-5 py-3 bg-white text-brand-text-dark border border-gray-200 rounded-[2rem] shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-150 ease-in-out"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-bold text-gray-800 mb-2">
              País de Influencia
            </label>
            <input
              type="text"
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Ej. México"
              className="w-full px-5 py-3 bg-white text-brand-text-dark border border-gray-200 rounded-[2rem] shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-150 ease-in-out"
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="pt-2">
          <label htmlFor="competitors" className="block text-sm font-bold text-gray-800 mb-2">
            Competidores (opcional, separados por coma)
          </label>
          <input
            type="text"
            id="competitors"
            value={competitors}
            onChange={(e) => setCompetitors(e.target.value)}
            placeholder="Ej. Pepsi, Dr Pepper, Jarritos"
            className="w-full px-5 py-3 bg-white text-brand-text-dark border border-gray-200 rounded-[2rem] shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-150 ease-in-out"
            disabled={isLoading}
          />
        </div>
        {error && <p className="text-brand-danger font-medium text-sm pt-2">{error}</p>}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-8 py-3.5 border border-transparent text-base font-bold rounded-[2rem] shadow-[0_4px_14px_0_rgba(115,0,255,0.39)] text-white bg-brand-primary hover:bg-[#6000d6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analizando...
              </>
            ) : (
              'Generar Análisis'
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default InputForm;