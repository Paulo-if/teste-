import React from 'react';

export default function Header({ siteConfig }) {
  const {
    title,
    headerSubtitle = 'Produtos pronta entrega em Goianésia-GO',
  } = siteConfig || { title: 'Links | Paulo' };

  return (
    <header className="bg-[#0F1F4D] text-white text-center py-[24px] px-[20px] shadow-sm">
      <h1 className="text-[22px] font-[800] tracking-[0.5px] leading-tight m-0 text-white">
        {title}
      </h1>
      <p className="text-[13px] text-white/75 mt-[6px] mb-0 font-normal">
        {headerSubtitle}
      </p>
    </header>
  );
}
