import React, { useState } from 'react';
import type { AnalysisData } from '../types';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

// Use globals from CDN
declare const html2canvas: any;
declare const jspdf: any;


interface ResultsDisplayProps {
  analysisData: AnalysisData | null;
  isLoading: boolean;
  brandName: string;
}

const LoadingSpinner: React.FC<{ brandName: string }> = ({ brandName }) => (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
      <svg className="animate-spin h-14 w-14 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="mt-6 text-xl font-bold text-brand-text-dark">Generando análisis para <span className="text-brand-primary">{brandName}</span>...</p>
      <p className="mt-2 text-gray-500 font-medium">Esto puede tomar unos momentos. Estamos recopilando y procesando los datos.</p>
    </div>
  );

const InitialState: React.FC = () => (
  <div className="text-center p-12 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
    <h2 className="text-3xl font-bold text-brand-primary font-display mb-4">Listo para analizar</h2>
    <p className="mt-2 text-gray-600 max-w-2xl mx-auto font-medium text-lg">
      Completa el formulario inicial para obtener un análisis competitivo detallado, incluyendo FODA, presencia digital, comparación de competidores, y recomendaciones estratégicas.
    </p>
  </div>
);

const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="pdf-section bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <h3 className="text-2xl font-bold text-brand-text-dark font-display mb-6">{title}</h3>
        {children}
    </div>
);

const SwotCard: React.FC<{ title: string; items: string[]; color: string; }> = ({ title, items, color }) => (
    <div className={`p-6 rounded-[2rem] ${color}`}>
        <h4 className="font-extrabold mb-3 text-lg">{title}</h4>
        <ul className="list-disc list-inside space-y-2 text-sm">
            {items.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
    </div>
);

const InteractiveTable: React.FC<{ title?: string, columns: { header: string, accessor: string }[], data: Record<string, any>[] }> = ({ title = 'Table-Data', columns, data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  const sortedData = React.useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const filteredData = React.useMemo(() => {
    return sortedData.filter(item => {
      return Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [sortedData, searchTerm]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    // Header
    csvContent += columns.map(c => `"${c.header}"`).join(',') + "\n";
    // Data
    filteredData.forEach(row => {
        csvContent += columns.map(c => `"${String(row[c.accessor]).replace(/"/g, '""')}"`).join(',') + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title.replace(/\s+/g, '-').toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
            onClick={handleExportCSV}
            className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-bold rounded-[2rem] shadow-[0_4px_14px_0_rgba(115,0,255,0.39)] text-white bg-brand-primary hover:bg-[#6000d6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all duration-200 w-full sm:w-auto justify-center"
        >
            Exportar CSV
        </button>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Buscar en la tabla..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm shadow-sm"
          />
          <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      <div className="overflow-x-auto rounded-[1.5rem] border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-[#f8f9fa] border-b border-gray-100 text-gray-700">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  onClick={() => requestSort(col.accessor)}
                  className="text-left py-4 px-6 uppercase font-bold tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none group whitespace-nowrap"
                >
                  <div className="flex items-center space-x-1">
                    <span>{col.header}</span>
                    <span className="text-gray-400 group-hover:text-brand-primary font-normal">
                        {sortConfig?.key === col.accessor 
                            ? (sortConfig.direction === 'asc' ? '↑' : '↓') 
                            : '↕'}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredData.length > 0 ? (
              filteredData.map((row, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.accessor} className="text-left py-3 px-6 font-medium">
                      {row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-gray-500 font-medium">
                  Sin resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ analysisData, isLoading, brandName }) => {
  const [isExporting, setIsExporting] = useState(false);

  if (isLoading) {
    return <div className="mt-8"><LoadingSpinner brandName={brandName} /></div>;
  }

  if (!analysisData) {
    return <div className="mt-8"><InitialState /></div>;
  }

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      let currentY = margin;
      
      const sections = document.querySelectorAll('.pdf-section');
      if (sections.length === 0) {
         console.warn("No .pdf-section elements found");
         setIsExporting(false);
         return;
      }
      
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i] as HTMLElement;
        
        // Ensure interactive tables are fully expanded for capture
        const originalOverflow = section.style.overflow;
        section.style.overflow = 'visible';
        
        const canvas = await html2canvas(section, { 
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });
        
        section.style.overflow = originalOverflow;

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        const ratio = imgWidth / (pdfWidth - margin * 2);
        const scaledImgHeight = imgHeight / ratio;
        
        if (currentY + scaledImgHeight > pdfHeight - margin && currentY > margin) {
            pdf.addPage();
            currentY = margin;
        }
        
        if (scaledImgHeight > pdfHeight - margin * 2) {
            let heightLeft = scaledImgHeight;
            let position = currentY;
            
            pdf.addImage(imgData, 'PNG', margin, position, pdfWidth - margin * 2, scaledImgHeight);
            let printedOnThisPage = pdfHeight - currentY;
            heightLeft -= printedOnThisPage;
            
            while (heightLeft > 0) {
                pdf.addPage();
                position -= printedOnThisPage;
                position += margin;
                pdf.addImage(imgData, 'PNG', margin, position, pdfWidth - margin * 2, scaledImgHeight);
                printedOnThisPage = pdfHeight - margin;
                heightLeft -= printedOnThisPage;
            }
            currentY = printedOnThisPage + heightLeft + margin + 5;
        } else {
            pdf.addImage(imgData, 'PNG', margin, currentY, pdfWidth - margin * 2, scaledImgHeight);
            currentY += scaledImgHeight + 5;
        }
      }

      pdf.save(`${brandName}-competitive-analysis.pdf`);
    } catch (err) {
      console.error("Error exporting to PDF:", err);
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleExportCSV = () => {
    if (!analysisData) return;
    setIsExporting(true);
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Analysis For,Category,Country\n";
    csvContent += `"${analysisData.brand}","${analysisData.category}","${analysisData.country}"\n\n`;
    csvContent += "SWOT,,,\n";
    csvContent += `Strengths,"${analysisData.swot.strengths.join('; ')}"\n`;
    csvContent += `Weaknesses,"${analysisData.swot.weaknesses.join('; ')}"\n`;
    csvContent += `Opportunities,"${analysisData.swot.opportunities.join('; ')}"\n`;
    csvContent += `Threats,"${analysisData.swot.threats.join('; ')}"\n\n`;
    csvContent += "Competitors\n";
    csvContent += "Name,Strengths,Weaknesses\n";
    analysisData.competitors.forEach(comp => {
        csvContent += `"${comp.name}","${comp.strengths.join('; ')}","${comp.weaknesses.join('; ')}"\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${brandName}-competitors.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExporting(false);
  };

  const handleExportTXT = () => {
    if (!analysisData) return;
    setIsExporting(true);
    let textContent = `ANÁLISIS COMPETITIVO PARA ${analysisData.brand}\n`;
    textContent += `Categoría: ${analysisData.category} | País: ${analysisData.country}\n\n`;
    textContent += `RESUMEN EJECUTIVO:\n${analysisData.summary}\n\n`;
    textContent += `ANÁLISIS FODA:\n`;
    textContent += `Fortalezas: ${analysisData.swot.strengths.join(', ')}\n`;
    textContent += `Debilidades: ${analysisData.swot.weaknesses.join(', ')}\n`;
    textContent += `Oportunidades: ${analysisData.swot.opportunities.join(', ')}\n`;
    textContent += `Amenazas: ${analysisData.swot.threats.join(', ')}\n\n`;
    textContent += `RECOMENDACIONES:\n${analysisData.recommendations.join('\n')}\n`;
    
    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${brandName}-analysis.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
    setIsExporting(false);
  };
  
  const { summary, swot, digitalPresence, competitors, recommendations } = analysisData;
  
  const platforms: (keyof typeof competitors[0]['mediaScores'])[] = ['google', 'meta', 'tiktok', 'x', 'programmatic'];
  const platformLabels: { [key in typeof platforms[number]]: string } = {
      google: 'Google',
      meta: 'Meta',
      tiktok: 'TikTok',
      x: 'X',
      programmatic: 'Programmatic'
  };

  const radarChartData = platforms.map(platform => {
    const platformData: { platform: string; [key: string]: string | number } = { platform: platformLabels[platform] };
    competitors.forEach(competitor => {
        platformData[competitor.name] = competitor.mediaScores[platform];
    });
    return platformData;
  });

  const brandColors = ['#7300FF', '#00E4F0', '#2E4BFF', '#0CDA4A', '#FE1479', '#FC9300', '#FFE012'];

  const geoColumns = [
    { header: 'Competidor', accessor: 'competitor' },
    { header: 'Ubicación Clave', accessor: 'location' },
    { header: 'Influencia', accessor: 'influence' },
  ];
  
  const geoTableData = competitors.flatMap((c) => 
    (c.geographicCoverage && c.geographicCoverage.length > 0)
      ? c.geographicCoverage.map((geo) => ({
          competitor: c.name,
          location: geo.location,
          influence: geo.influence
        }))
      : [{ competitor: c.name, location: 'No hay datos geográficos disponibles.', influence: '-' }]
  );

  const socialColumns = [
    { header: 'Competidor', accessor: 'competitor' },
    { header: 'Plataforma', accessor: 'platform' },
    { header: 'Seguidores', accessor: 'followers' },
    { header: 'Engagement', accessor: 'engagement' },
  ];
  
  const socialTableData = competitors.flatMap((c) => 
    c.socialMediaPresence.map((social) => ({
        competitor: c.name,
        platform: social.platform,
        followers: social.followers,
        engagement: social.engagement
    }))
  );

  return (
    <div className="mt-8">
        <div className="flex flex-wrap gap-4 justify-end mb-6">
            <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-bold rounded-[2rem] shadow-[0_4px_14px_0_rgba(115,0,255,0.39)] text-white bg-brand-primary hover:bg-[#6000d6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-200"
            >
                 {isExporting ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Exportando...
                    </>
                 ) : 'Exportar PDF'}
            </button>
            <button
                onClick={handleExportCSV}
                disabled={isExporting}
                className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-bold rounded-[2rem] shadow-[0_4px_14px_0_rgba(115,0,255,0.39)] text-white bg-brand-primary hover:bg-[#6000d6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-200"
            >
                 {isExporting ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Exportando...
                    </>
                 ) : 'Exportar CSV'}
            </button>
            <button
                onClick={handleExportTXT}
                disabled={isExporting}
                className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-bold rounded-[2rem] shadow-[0_4px_14px_0_rgba(115,0,255,0.39)] text-white bg-brand-primary hover:bg-[#6000d6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-200"
            >
                 {isExporting ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Exportando...
                    </>
                 ) : 'Exportar TXT'}
            </button>
        </div>
        <section id="report-content" className="space-y-8 bg-transparent p-2 sm:p-4 rounded-[2rem]">
            <header className="pdf-section text-center mb-10 bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                <h2 className="text-4xl font-extrabold text-[#000000] font-sans tracking-tight">Análisis Competitivo de <span className="text-brand-primary">{analysisData.brand}</span></h2>
                <p className="text-xl text-gray-500 mt-2 font-medium">{analysisData.category} en {analysisData.country}</p>
            </header>

            <InfoCard title="Resumen Ejecutivo">
                <p className="text-brand-text-medium">{summary}</p>
            </InfoCard>

            <InfoCard title="Análisis FODA">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SwotCard title="Fortalezas" items={swot.strengths} color="bg-green-100 text-green-800" />
                    <SwotCard title="Debilidades" items={swot.weaknesses} color="bg-red-100 text-red-800" />
                    <SwotCard title="Oportunidades" items={swot.opportunities} color="bg-blue-100 text-blue-800" />
                    <SwotCard title="Amenazas" items={swot.threats} color="bg-yellow-100 text-yellow-800" />
                </div>
            </InfoCard>

            <InfoCard title="Presencia Digital">
                <div className="space-y-4">
                    <div>
                        <h4 className="font-bold text-brand-text-dark">Sitio Web SEO</h4>
                        <p className="text-brand-text-medium">{digitalPresence.websiteSEO}</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-brand-text-dark">Redes Sociales</h4>
                        <p className="text-brand-text-medium">{digitalPresence.socialMedia}</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-brand-text-dark">Estrategia de Contenido</h4>
                        <p className="text-brand-text-medium">{digitalPresence.contentStrategy}</p>
                    </div>
                </div>
            </InfoCard>
            
            <div className="space-y-8">
                <div className="pdf-section bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                    <h3 className="text-2xl font-bold text-brand-text-dark font-display mb-6">Análisis de Competidores & Comparación FODA</h3>
                    <p className="text-brand-text-medium">Desglose detallado de fortalezas, debilidades, alcance social y cobertura geográfica de cada competidor.</p>
                </div>
                {competitors.map((competitor, index) => (
                    <div key={index} className="pdf-section p-8 border border-gray-100 rounded-[2rem] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <h4 className="text-3xl font-extrabold text-[#7300FF] mb-6 border-b border-gray-100 pb-4">{competitor.name}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SwotCard 
                                title="Fortalezas" 
                                items={competitor.strengths} 
                                color="bg-green-50 text-green-800" 
                            />
                            <SwotCard 
                                title="Debilidades" 
                                items={competitor.weaknesses} 
                                color="bg-red-50 text-red-800" 
                            />
                        </div>
                        
                        <div className="mt-8 space-y-6">
                            <div>
                                <h5 className="text-lg font-bold text-gray-800 mb-4">Presencia en Redes Sociales</h5>
                                <InteractiveTable 
                                    title={`${competitor.name} Presencia en Redes Sociales`}
                                    columns={[
                                        { header: 'Plataforma', accessor: 'platform' },
                                        { header: 'Seguidores', accessor: 'followers' },
                                        { header: 'Engagement', accessor: 'engagement' },
                                    ]} 
                                    data={competitor.socialMediaPresence.map(social => ({
                                        platform: social.platform,
                                        followers: social.followers,
                                        engagement: social.engagement
                                    }))} 
                                />
                            </div>
                            <div className="mt-8">
                                <h5 className="text-lg font-bold text-gray-800 mb-4">Cobertura Geográfica</h5>
                                <InteractiveTable 
                                    title={`${competitor.name} Cobertura Geográfica`}
                                    columns={[
                                        { header: 'Ubicación Clave', accessor: 'location' },
                                        { header: 'Influencia', accessor: 'influence' },
                                    ]} 
                                    data={(competitor.geographicCoverage && competitor.geographicCoverage.length > 0)
                                        ? competitor.geographicCoverage.map(geo => ({
                                            location: geo.location,
                                            influence: geo.influence
                                        }))
                                        : [{ location: 'No hay datos geográficos disponibles.', influence: '-' }]
                                    } 
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <InfoCard title="Visualización de Presencia en Medios">
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarChartData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="platform" />
                            <Tooltip />
                            <Legend />
                            {competitors.map((competitor, index) => (
                                <Radar 
                                    key={competitor.name} 
                                    name={competitor.name} 
                                    dataKey={competitor.name} 
                                    stroke={brandColors[index % brandColors.length]} 
                                    fill={brandColors[index % brandColors.length]} 
                                    fillOpacity={0.6} 
                                />
                            ))}
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </InfoCard>

            {analysisData.marketComparisons && analysisData.marketComparisons.length > 0 && (
                <InfoCard title="Estrategia de Precios e Inversión Publicitaria (Estimada)">
                    <div className="space-y-8">
                        <InteractiveTable 
                            title="Comparativa de Mercado"
                            columns={[
                                { header: 'Entidad', accessor: 'entityName' },
                                { header: 'Estrategia de Precios', accessor: 'pricingStrategy' },
                                { header: 'Inversión Publicitaria Est.', accessor: 'estimatedAdSpend' },
                            ]} 
                            data={analysisData.marketComparisons.map(mc => ({
                                entityName: mc.entityName,
                                pricingStrategy: mc.pricingStrategy,
                                estimatedAdSpend: mc.estimatedAdSpend
                            }))} 
                        />

                        <div className="mt-8 bg-gray-50 p-6 rounded-2xl border border-gray-100 hidden sm:block">
                            <h4 className="text-lg font-bold text-gray-800 mb-6 text-center">Nivel de Inversión Publicitaria Estimado (Puntuación 1-10)</h4>
                            <div style={{ width: '100%', height: 350 }}>
                                <ResponsiveContainer>
                                    <BarChart data={analysisData.marketComparisons} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis dataKey="entityName" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontWeight: 600}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} domain={[0, 10]} />
                                        <Tooltip 
                                            cursor={{fill: 'transparent'}}
                                            contentStyle={{borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'}}
                                        />
                                        <Legend wrapperStyle={{paddingTop: '20px'}} />
                                        <Bar dataKey="spendScore" name="Estimación Inversión (Score 1-10)" fill="#7300FF" radius={[6, 6, 0, 0]} maxBarSize={60} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </InfoCard>
            )}

            <InfoCard title="Recomendaciones Estratégicas">
                <ul className="list-disc list-inside space-y-2 text-brand-text-medium">
                    {recommendations.map((rec, index) => <li key={index}>{rec}</li>)}
                </ul>
            </InfoCard>
        </section>
    </div>
  );
};

export default ResultsDisplay;
