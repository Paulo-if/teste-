import React from 'react';
import { Search, MapPin } from 'lucide-react';

export default function SearchBar({
  searchTerm,
  setSearchTerm,
  isLocal,
  siteConfig,
  onOpenModal
}) {
  return (
    <div className="sticky top-0 z-30 bg-[#F1F5F9]/95 backdrop-blur-md pt-4 pb-3 px-4 border-b border-[#E2E8F0]/60">
      <div className="relative flex items-center w-full">
        <Search
          size={18}
          className="absolute left-3.5 text-[#0F172A] opacity-50 pointer-events-none"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar produto..."
          aria-label="Buscar produto"
          className="w-full bg-white text-[#0F172A] placeholder-[#0F172A]/50 text-[15px] pl-10 pr-4 py-3 rounded-[12px] border-[1.5px] border-[#E2E8F0] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all shadow-sm"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 text-xs text-[#0F172A]/50 hover:text-[#0F172A] bg-[#F1F5F9] rounded-full w-5 h-5 flex items-center justify-center font-bold"
            aria-label="Limpar busca"
          >
            ✕
          </button>
        )}
      </div>

      <div className="mt-2 text-center text-[12px] font-bold text-[#2563EB] flex items-center justify-center gap-1.5 flex-wrap">
        <MapPin size={14} className="text-[#2563EB]" />
        {isLocal === true ? (
          <>
            <span>{siteConfig?.localStatusText ?? 'Cliente de Goianésia-GO'}</span>
            <button
              onClick={onOpenModal}
              className="text-[#64748B] underline font-normal text-[11px] hover:text-[#2563EB] transition-colors cursor-pointer"
            >
              alterar
            </button>
          </>
        ) : isLocal === false ? (
          <>
            <span>{siteConfig?.onlineStatusText ?? 'loja online'}</span>
            <button
              onClick={onOpenModal}
              className="text-[#64748B] underline font-normal text-[11px] hover:text-[#2563EB] transition-colors cursor-pointer"
            >
              alterar
            </button>
          </>
        ) : (
          <>
            <span>Selecione sua localização</span>
            <button
              onClick={onOpenModal}
              className="text-[#64748B] underline font-normal text-[11px] hover:text-[#2563EB] transition-colors cursor-pointer"
            >
              definir
            </button>
          </>
        )}
      </div>
    </div>
  );
}
