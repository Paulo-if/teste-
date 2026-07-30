import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ProductFeed from './components/ProductFeed';
import LocationModal from './components/LocationModal';
import AdminModal from './components/AdminModal';
import Footer from './components/Footer';
import {
  PRODUTOS_PADRAO,
  SITE_CONFIG_PADRAO,
  loadProdutos,
  loadSiteConfig,
  saveProdutos,
  saveSiteConfig,
  WHATSAPP_NUMERO,
  WHATSAPP_MENSAGEM_TEMPLATE,
} from './data/productsData';

export default function App() {
  const [products, setProducts] = useState(loadProdutos);
  const [siteConfig, setSiteConfig] = useState(loadSiteConfig);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLocal, setIsLocal] = useState(null); // null = unanswered, true = Goianésia, false = fora
  const [isModalOpen, setIsModalOpen] = useState(true); // Location Modal visible on load
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false); // Admin Modal state
  const [pendingProduct, setPendingProduct] = useState(null);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const term = searchTerm.toLowerCase().trim();
    return products.filter((p) => p.nome.toLowerCase().includes(term));
  }, [searchTerm, products]);

  const handleSaveProducts = (newProductsList) => {
    setProducts(newProductsList);
    saveProdutos(newProductsList);
  };

  const handleSaveSiteConfig = (newSiteConfig) => {
    setSiteConfig(newSiteConfig);
    saveSiteConfig(newSiteConfig);
  };

  const handleResetDefaults = () => {
    setProducts(PRODUTOS_PADRAO);
    saveProdutos(PRODUTOS_PADRAO);
  };

  const handleSelectLocation = (localChoice) => {
    setIsLocal(localChoice);
    setIsModalOpen(false);

    if (pendingProduct) {
      executeRedirect(pendingProduct, localChoice);
      setPendingProduct(null);
    }
  };

  const executeRedirect = (product, localStatus) => {
    if (localStatus === true) {
      const text = encodeURIComponent(WHATSAPP_MENSAGEM_TEMPLATE(product.nome));
      const waUrl = `https://wa.me/${WHATSAPP_NUMERO}?text=${text}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } else if (localStatus === false) {
      window.open(product.shopeeLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSelectProduct = (product) => {
    if (isLocal === null) {
      setPendingProduct(product);
      setIsModalOpen(true);
      return;
    }

    executeRedirect(product, isLocal);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans antialiased text-[#0F172A]">
      <div className="max-w-[480px] mx-auto min-h-screen bg-[#F1F5F9] flex flex-col min-h-screen">
        <Header siteConfig={siteConfig} />

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isLocal={isLocal}
          siteConfig={siteConfig}
          onOpenModal={() => setIsModalOpen(true)}
        />

        <main className="flex-grow min-h-0 overflow-y-auto">
          <ProductFeed products={filteredProducts} onSelectProduct={handleSelectProduct} siteConfig={siteConfig} />
        </main>

        <Footer siteConfig={siteConfig} onOpenAdminModal={() => setIsAdminModalOpen(true)} />
      </div>

      <LocationModal
        isOpen={isModalOpen}
        siteConfig={siteConfig}
        onSelectLocation={handleSelectLocation}
      />

      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        products={products}
        siteConfig={siteConfig}
        onSaveProducts={handleSaveProducts}
        onSaveSiteConfig={handleSaveSiteConfig}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}
