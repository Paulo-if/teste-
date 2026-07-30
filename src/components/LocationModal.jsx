import React from 'react';
import { MapPin } from 'lucide-react';

export default function LocationModal({ isOpen, siteConfig, onSelectLocation }) {
  if (!isOpen) return null;

  const {
    locationPopupTitle = 'Você é de Goianésia-GO?',
    locationPopupDescription =
      'Assim conseguimos te atender do melhor jeito, seja por aqui pertinho ou pela loja online.',
    locationPopupYesButton = 'Sim, sou daqui',
    locationPopupNoButton = 'Não, sou de fora',
  } = siteConfig || {};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-250 ease-out"
      style={{
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
    >
      <div className="bg-white rounded-[20px] max-w-[340px] w-full p-6 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-center mb-3 text-[#2563EB]">
          <MapPin size={32} />
        </div>

        <h2 className="text-[18px] font-[800] text-[#0F172A] mb-2 leading-tight">
          {locationPopupTitle}
        </h2>

        <p className="text-[13.5px] text-[#64748B] leading-relaxed mb-6">
          {locationPopupDescription}
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => onSelectLocation(true)}
            className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.97] text-white font-[700] text-[15px] rounded-[12px] py-3.5 transition-all shadow-md cursor-pointer"
          >
            {locationPopupYesButton}
          </button>

          <button
            type="button"
            onClick={() => onSelectLocation(false)}
            className="w-full bg-[#F1F5F9] hover:bg-[#E2E8F0] active:scale-[0.97] text-[#0F172A] font-[600] text-[15px] rounded-[12px] py-3.5 border-[1.5px] border-[#E2E8F0] transition-all cursor-pointer"
          >
            {locationPopupNoButton}
          </button>
        </div>
      </div>
    </div>
  );
}
