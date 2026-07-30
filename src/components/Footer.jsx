import React from 'react';
import { Settings } from 'lucide-react';

export default function Footer({ siteConfig, onOpenAdminModal }) {
  const footerText = (siteConfig && siteConfig.footerText) || 'Feito com 💙 para atender melhor você';

  return (
    <footer className="py-8 text-center text-[11px] text-[#64748B] tracking-wide select-none flex items-center justify-center gap-1.5">
      <span>{footerText}</span>
      <button
        type="button"
        onClick={onOpenAdminModal}
        title="Área-ADM"
        aria-label="Abrir Área Administrativa"
        className="p-1 text-[#64748B] hover:text-[#2563EB] hover:bg-[#E2E8F0]/80 rounded-full transition-all cursor-pointer inline-flex items-center justify-center"
      >
        <Settings size={14} className="transition-transform hover:rotate-45" />
      </button>
    </footer>
  );
}
