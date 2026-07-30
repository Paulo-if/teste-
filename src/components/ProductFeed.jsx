import React from 'react';
import { SearchX } from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductFeed({ products, onSelectProduct, siteConfig }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center mb-3">
          <SearchX size={32} />
        </div>
        <p className="text-[16px] font-[700] text-[#0F172A] mb-1">Nenhum produto encontrado</p>
        <p className="text-[13px] text-[#64748B]">Tente buscar por outro termo ou limpe a busca.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[28px] px-4 py-6 snap-y snap-proximity">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onSelectProduct={onSelectProduct} siteConfig={siteConfig} />
      ))}
    </div>
  );
}
