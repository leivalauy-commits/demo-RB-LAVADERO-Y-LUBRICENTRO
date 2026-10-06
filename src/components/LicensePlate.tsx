import React from 'react';

interface LicensePlateProps {
  plate: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LicensePlate: React.FC<LicensePlateProps> = ({ plate, size = 'md', className = '' }) => {
  const isMercosur = /^[A-Z]{2}\s?\d{3}\s?[A-Z]{2}$/i.test(plate.trim());
  const cleanPlate = plate.toUpperCase().trim();

  if (size === 'sm') {
    return (
      <span
        style={{ backgroundColor: '#0D0D0D', borderColor: '#242424' }}
        className={`inline-flex items-center font-mono font-bold tracking-wider px-2 py-0.5 rounded border text-white text-xs shadow-xs ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 inline-block"></span>
        {cleanPlate}
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div
        style={{ borderColor: '#242424' }}
        className={`inline-flex flex-col rounded-md border-2 bg-white text-slate-950 font-mono shadow-md overflow-hidden min-w-[150px] ${className}`}
      >
        {isMercosur ? (
          <div className="bg-blue-700 px-2 py-0.5 flex items-center justify-between text-[10px] text-white font-sans font-bold tracking-widest uppercase">
            <span>REPÚBLICA ARGENTINA</span>
            <span className="text-[9px] bg-white/20 px-1 rounded">MERCOSUR</span>
          </div>
        ) : (
          <div className="bg-slate-900 text-[10px] text-slate-200 px-2 py-0.5 font-sans uppercase font-bold text-center">
            ARGENTINA
          </div>
        )}
        <div className="px-3 py-1 text-center text-lg font-black tracking-widest text-slate-950 bg-slate-100">
          {cleanPlate}
        </div>
      </div>
    );
  }

  // Medium (standard default)
  return (
    <div
      style={{ backgroundColor: '#0D0D0D', borderColor: '#242424' }}
      className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1 text-xs font-mono font-bold tracking-wider text-white shadow-xs ${className}`}
    >
      <span className="h-2 w-2 rounded-full bg-blue-500 shadow-xs" title="Mercosur / Argentina" />
      <span className="tracking-widest">{cleanPlate}</span>
    </div>
  );
};
