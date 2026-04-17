import React from 'react';
import type { AnalysisRecord } from '../types';

interface HistorySidebarProps {
  history: AnalysisRecord[];
  onSelect: (record: AnalysisRecord) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  isOpen: boolean;
  onClose: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onSelect, onDelete, isOpen, onClose }) => {
  return (
    <aside 
      className={`fixed top-0 left-0 h-full w-64 lg:w-80 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.06)] z-30 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h2 className="text-xl font-extrabold text-brand-primary font-display tracking-wide">Historial</h2>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors focus:outline-none"
          aria-label="Cerrar historial"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {history.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium text-sm">No hay análisis previos</p>
          </div>
        ) : (
          history.map((record) => {
            const date = new Date(record.timestamp);
            const formattedDate = date.toLocaleDateString('es-MX', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            });
            const formattedTime = date.toLocaleTimeString('es-MX', {
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div 
                key={record.id}
                onClick={() => onSelect(record)}
                className="group relative p-4 bg-gray-50 hover:bg-brand-primary hover:text-white rounded-2xl cursor-pointer transition-all duration-200 border border-transparent hover:shadow-[0_4px_14px_0_rgba(115,0,255,0.2)]"
              >
                <div className="pr-8">
                  <h3 className="font-bold text-base truncate group-hover:text-white text-gray-800">
                    {record.data.brand}
                  </h3>
                  <p className="text-xs text-gray-500 group-hover:text-gray-200 mt-1 truncate">
                    {record.data.category} &bull; {record.data.country}
                  </p>
                  <p className="text-[10px] text-gray-400 group-hover:text-gray-300 mt-2 font-mono uppercase tracking-widest">
                    {formattedDate} {formattedTime}
                  </p>
                </div>
                <button
                  onClick={(e) => onDelete(record.id, e)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
                  aria-label="Eliminar análisis"
                  title="Eliminar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};

export default HistorySidebar;
