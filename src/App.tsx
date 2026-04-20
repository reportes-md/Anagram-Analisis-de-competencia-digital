import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import ResultsDisplay from './components/ResultsDisplay';
import HistorySidebar from './components/HistorySidebar';
import { getCompetitiveAnalysis } from './services/geminiService';
import type { AnalysisData, AnalysisRecord } from './types';

const App: React.FC = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentBrand, setCurrentBrand] = useState('');
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('analysisHistory');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const saveToHistory = (data: AnalysisData) => {
    const newRecord: AnalysisRecord = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      data
    };
    setHistory(prev => {
      const newHistory = [newRecord, ...prev];
      localStorage.setItem('analysisHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const deleteFromHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => {
      const newHistory = prev.filter(r => r.id !== id);
      localStorage.setItem('analysisHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const handleSelectHistory = (record: AnalysisRecord) => {
    setAnalysisData(record.data);
    setCurrentBrand(record.data.brand);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalyze = async (brand: string, category: string, country: string, competitors: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysisData(null);
    setCurrentBrand(brand);

    try {
      const data = await getCompetitiveAnalysis(brand, category, country, competitors);
      setAnalysisData(data);
      saveToHistory(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error desconocido.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-brand-background min-h-screen flex text-brand-text-dark font-sans relative overflow-x-hidden">
      <HistorySidebar 
        history={history} 
        onSelect={handleSelectHistory} 
        onDelete={deleteFromHistory}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? 'ml-64 lg:ml-80' : 'ml-0'}`}>
        <header className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.05)] border-b border-gray-100 sticky top-0 z-10 w-full">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                <div className="flex items-center">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 mr-4 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        aria-label="Alternar menú de historial"
                    >
                        <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <img src="https://anagram-us.com/wp-content/uploads/2023/06/Logo-anagram.svg" alt="Anagram Logo" className="h-8 md:h-10" referrerPolicy="no-referrer" />
                </div>
                <h1 className="text-xl md:text-2xl font-extrabold text-[#7300FF] font-sans tracking-tight text-right hidden sm:block">
                    Análisis Competitivo IA
                </h1>
            </div>
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
          <InputForm onAnalyze={handleAnalyze} isLoading={isLoading} />
          
          {error && (
              <div className="mt-8 bg-red-100 border-l-4 border-brand-danger text-red-700 p-4 rounded-md" role="alert">
                  <p className="font-bold">Ocurrió un error</p>
                  <p>{error}</p>
              </div>
          )}

          <ResultsDisplay analysisData={analysisData} isLoading={isLoading} brandName={currentBrand} />
        </main>
        
        <footer className="bg-black mt-auto py-6 border-none">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-6 mb-4 md:mb-0">
                   <img 
                      src="https://anagram-us.com/wp-content/uploads/2023/06/Logo-anagram.svg" 
                      alt="Anagram Logo" 
                      className="h-6 sm:h-8 filter invert brightness-0" 
                      referrerPolicy="no-referrer" 
                   />
                   <span className="text-white text-[10px] sm:text-xs tracking-[0.2em] font-bold">
                      A R Q U I T E C T &nbsp;&nbsp;&bull;&nbsp;&nbsp; 2 0 2 6
                   </span>
              </div>
              <div>
                   <div className="bg-[#1c0042] text-white text-[8px] sm:text-[10px] font-bold tracking-[0.2em] py-2 px-3 sm:px-4 uppercase">
                      DESARROLLADO PARA ANAGRAM AGENCY
                   </div>
              </div>
          </div>
        </footer>
      </div>

      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 shadow-lg lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default App;
