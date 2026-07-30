import React, { useEffect, useRef, useState } from 'react';

export default function ProductCard({ product, onSelectProduct, siteConfig }) {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, []);

  const hasPhoto = Boolean(product.imagem && product.imagem.trim() !== '' && !imgError);

  return (
    <article
      ref={cardRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0px) scale(1)' : 'translateY(40px) scale(0.96)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
      className="bg-white rounded-[22px] border border-[#E2E8F0] shadow-[0_4px_16px_rgba(15,23,42,0.08)] overflow-hidden flex flex-col select-none snap-start"
    >
      <div className="w-full aspect-square relative overflow-hidden flex items-center justify-center bg-[#0F172A]/5">
        {hasPhoto ? (
          <img
            src={product.imagem}
            alt={product.nome}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div
            style={{
              background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
            }}
            className="w-full h-full flex flex-col items-center justify-center text-white p-6"
          >
            <span className="text-[110px] leading-none">🎁</span>
          </div>
        )}
      </div>

      <div className="p-[20px_22px_24px] flex flex-col justify-between flex-grow">
        <h2 className="text-[22px] font-[800] text-[#0F172A] leading-snug mb-5">{product.nome}</h2>

        <button
          type="button"
          onClick={() => onSelectProduct(product)}
          style={{ backgroundColor: (siteConfig && siteConfig.primaryButtonColor) || '#2563EB' }}
          className="w-full text-white font-[700] text-[16px] rounded-[12px] py-[15px] transition-all shadow-md flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50"
        >
          Ver produto
        </button>
      </div>
    </article>
  );
}
