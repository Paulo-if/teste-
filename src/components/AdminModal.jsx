import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Lock, User, KeyRound, LogOut, CheckCircle, Eye, EyeOff, X,
  Plus, Trash2, Save, Upload, Link, Package, Camera, ShoppingBag
} from 'lucide-react';
import { verifyAdminCredentials } from '../utils/security';
import { compressGalleryImage } from '../utils/imageUtils';

export default function AdminModal({ isOpen, onClose, products, siteConfig, onSaveProducts, onSaveSiteConfig, onResetDefaults }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [processingImageId, setProcessingImageId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSiteConfigPopupOpen, setIsSiteConfigPopupOpen] = useState(false);
  const [activeConfigSection, setActiveConfigSection] = useState('identity');
  const [editableSiteConfig, setEditableSiteConfig] = useState({
    title: 'Links',
    headerSubtitle: 'Produtos pronta entrega em Goianésia-GO',
    locationPopupTitle: 'Você é de Goianésia-GO?',
    locationPopupDescription:
      'Assim conseguimos te atender do melhor jeito, seja por aqui pertinho ou pela loja online.',
    locationPopupYesButton: 'Sim, sou daqui',
    locationPopupNoButton: 'Não, sou de fora',
    localStatusText: 'Cliente de Goianésia-GO',
    onlineStatusText: 'loja online',
    primaryButtonColor: '#2563EB',
    footerText: 'Feito com 💙 para atender melhor você',
  });

  // Editable product state in admin mode
  const [editableProducts, setEditableProducts] = useState([]);

  // Sync products when modal opens or products or siteConfig prop changes
  useEffect(() => {
    if (products) {
      setEditableProducts(JSON.parse(JSON.stringify(products)));
    }
    if (siteConfig) {
      setEditableSiteConfig({
        title: siteConfig.title || 'Links',
        headerSubtitle: siteConfig.headerSubtitle || 'Produtos pronta entrega em Goianésia-GO',
        locationPopupTitle: siteConfig.locationPopupTitle || 'Você é de Goianésia-GO?',
        locationPopupDescription:
          siteConfig.locationPopupDescription ||
          'Assim conseguimos te atender do melhor jeito, seja por aqui pertinho ou pela loja online.',
        locationPopupYesButton: siteConfig.locationPopupYesButton || 'Sim, sou daqui',
        locationPopupNoButton: siteConfig.locationPopupNoButton || 'Não, sou de fora',
        localStatusText: siteConfig.localStatusText || 'Cliente de Goianésia-GO',
        onlineStatusText: siteConfig.onlineStatusText || 'loja online',
        primaryButtonColor: siteConfig.primaryButtonColor || '#2563EB',
        footerText: siteConfig.footerText || 'Feito com 💙 para atender melhor você',
      });
    }
  }, [products, siteConfig, isOpen]);

  useEffect(() => {
    if (isSiteConfigPopupOpen) {
      setActiveConfigSection('identity');
    }
  }, [isSiteConfigPopupOpen]);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const isValid = await verifyAdminCredentials(username, password);
      if (isValid) {
        setIsAuthenticated(true);
        setErrorMessage('');
      } else {
        setErrorMessage('Nome de usuário ou senha incorretos.');
      }
    } catch (err) {
      setErrorMessage('Erro ao autenticar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setErrorMessage('');
    setSaveSuccessMsg('');
    onClose();
  };

  const handleModalClose = () => {
    setErrorMessage('');
    onClose();
  };

  // Product Field Handlers
  const handleFieldChange = (id, field, value) => {
    setEditableProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Gallery Photo Upload Handler
  const handleImageFileChange = async (id, file) => {
    if (!file) return;
    setProcessingImageId(id);
    try {
      const compressedDataUrl = await compressGalleryImage(file);
      handleFieldChange(id, 'imagem', compressedDataUrl);
    } catch (err) {
      alert('Erro ao processar imagem da galeria. Tente novamente.');
    } finally {
      setProcessingImageId(null);
    }
  };

  const handleRemovePhoto = (id) => {
    handleFieldChange(id, 'imagem', '');
  };

  const handleAddProduct = () => {
    const newId = Date.now();
    const newProd = {
      id: newId,
      nome: 'Novo Produto',
      imagem: '',
      shopeeLink: 'https://shopee.com.br/',
      whatsappLink: '',
    };
    setEditableProducts((prev) => [...prev, newProd]);
  };

  const handleSiteConfigChange = (field, value) => {
    setEditableSiteConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeleteProduct = (id) => {
    setDeleteTarget(id);
  };

  const confirmDeleteProduct = () => {
    if (deleteTarget !== null) {
      setEditableProducts((prev) => prev.filter((item) => item.id !== deleteTarget));
      setDeleteTarget(null);
      setSaveSuccessMsg('Produto removido com sucesso!');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    }
  };

  const cancelDeleteProduct = () => {
    setDeleteTarget(null);
  };

  const handleSaveAll = () => {
    onSaveProducts(editableProducts);
    onSaveSiteConfig(editableSiteConfig);
    setSaveSuccessMsg('Catálogo atualizado e salvo no dispositivo com sucesso! 💾');
    setTimeout(() => {
      setSaveSuccessMsg('');
    }, 3000);
  };

  const handleSaveSiteConfigSettings = () => {
    onSaveSiteConfig(editableSiteConfig);
    setSaveSuccessMsg('Configurações do site salvas com sucesso! 💾');
    setTimeout(() => {
      setSaveSuccessMsg('');
    }, 3000);
    setIsSiteConfigPopupOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 transition-opacity duration-250 ease-out"
      style={{
        backgroundColor: 'rgba(15, 23, 42, 0.70)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
      }}
    >
      <div
        className={`bg-white rounded-[22px] w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 border border-[#E2E8F0] flex flex-col ${
          isAuthenticated ? 'max-w-[460px] max-h-[88vh]' : 'max-w-[360px] p-6 text-center'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleModalClose}
          className="absolute top-4 right-4 z-10 text-[#64748B] hover:text-[#0F1F4D] p-1.5 rounded-full hover:bg-[#F1F5F9] transition-colors"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>

        {!isAuthenticated ? (
          /* LOGIN FORM */
          <div>
            <div className="w-12 h-12 bg-[#2563EB]/10 text-[#2563EB] rounded-full flex items-center justify-center mx-auto mb-3">
              <Lock size={24} />
            </div>

            <h2 className="text-[20px] font-[800] text-[#0F172A] mb-1 leading-tight">
              Área-ADM
            </h2>
            <p className="text-[13px] text-[#64748B] mb-5">
              Informe suas credenciais para gerenciar produtos.
            </p>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-[12px] font-bold text-[#0F172A] mb-1">
                  Usuário
                </label>
                <div className="relative flex items-center">
                  <User size={16} className="absolute left-3 text-[#64748B]" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Digite seu usuário"
                    required
                    className="w-full bg-[#F1F5F9] text-[#0F172A] text-[14px] pl-9 pr-3 py-2.5 rounded-[10px] border border-[#E2E8F0] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#0F172A] mb-1">
                  Senha
                </label>
                <div className="relative flex items-center">
                  <KeyRound size={16} className="absolute left-3 text-[#64748B]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    required
                    className="w-full bg-[#F1F5F9] text-[#0F172A] text-[14px] pl-9 pr-9 py-2.5 rounded-[10px] border border-[#E2E8F0] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-[#64748B] hover:text-[#0F172A]"
                    aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-[12px] rounded-[8px] text-center font-medium">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.97] text-white font-[700] text-[15px] rounded-[12px] py-3 mt-2 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Verificando...</span>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    <span>Entrar no Painel</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED CATALOG MANAGEMENT PANEL */
          <div className="flex flex-col h-full overflow-hidden p-5">
            {/* Admin Header */}
            <div className="border-b border-[#E2E8F0] pb-3.5 mb-3 pr-6">
              <div className="flex items-center gap-2 text-[#2563EB] font-extrabold text-[12px] uppercase tracking-wider mb-1">
                <ShieldCheck size={16} />
                <span>Painel Administrativo</span>
              </div>
              <h2 className="text-[20px] font-[800] text-[#0F172A] leading-tight">
                Gerenciar Catálogo 🛍️
              </h2>
              <p className="text-[12px] text-[#64748B] mt-0.5">
                Escolha fotos direto da galeria do seu celular!
              </p>
            </div>

            {/* Success Toast */}
            {saveSuccessMsg && (
              <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12.5px] rounded-[10px] flex items-center justify-center gap-2 font-semibold animate-in fade-in">
                <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            {/* Controls Bar */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[12px] font-bold text-[#0F172A]">
                Total: {editableProducts.length} produtos
              </span>
              <button
                type="button"
                onClick={handleAddProduct}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.96] text-white text-[12px] font-bold py-2 px-3 rounded-[10px] flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Plus size={15} />
                <span>Novo Produto</span>
              </button>
              <button
                type="button"
                onClick={() => setIsSiteConfigPopupOpen(true)}
                className="bg-[#0F172A] hover:bg-[#1E293B] active:scale-[0.96] text-white text-[12px] font-bold py-2 px-3 rounded-[10px] flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Package size={15} />
                <span>Configurações do Site</span>
              </button>
            </div>

            {/* Scrollable Editable Products List */}
            <div className="flex-grow overflow-y-auto space-y-4 pr-1 mb-3 no-scrollbar">
              {editableProducts.map((prod, index) => {
                const hasPhoto = Boolean(prod.imagem && prod.imagem.trim() !== '');

                return (
                  <div
                    key={prod.id}
                    className="bg-[#F1F5F9] rounded-[18px] p-3.5 border border-[#E2E8F0] space-y-3 relative"
                  >
                    {/* Card Header & Delete Button */}
                    <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                      <span className="text-[12px] font-bold text-[#2563EB] bg-white px-2.5 py-0.5 rounded-full border border-[#E2E8F0]">
                        Produto #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Excluir produto"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Photo Gallery Selector Section */}
                    <div className="bg-white p-3 rounded-[14px] border border-[#E2E8F0] flex items-center gap-3">
                      {/* Photo Preview / Fallback */}
                      <div className="w-16 h-16 rounded-[12px] overflow-hidden bg-[#0F172A]/5 border border-[#E2E8F0] shrink-0 flex items-center justify-center relative group">
                        {hasPhoto ? (
                          <img
                            src={prod.imagem}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            style={{
                              background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
                            }}
                            className="w-full h-full flex items-center justify-center text-white"
                          >
                            <ShoppingBag size={26} className="text-white/90" />
                          </div>
                        )}
                      </div>

                      {/* Photo Upload Actions */}
                      <div className="flex-grow space-y-1.5">
                        <label className="block text-[11px] font-bold text-[#0F172A] flex items-center gap-1">
                          <Camera size={13} className="text-[#2563EB]" />
                          <span>Foto do Produto</span>
                        </label>

                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Hidden File Input */}
                          <input
                            type="file"
                            accept="image/*"
                            id={`file-input-${prod.id}`}
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleImageFileChange(prod.id, e.target.files[0]);
                              }
                            }}
                          />

                          {/* Gallery Button */}
                          <label
                            htmlFor={`file-input-${prod.id}`}
                            className="bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.96] text-white text-[12px] font-bold py-1.5 px-3 rounded-[8px] flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                          >
                            <Upload size={13} />
                            <span>
                              {processingImageId === prod.id
                                ? 'Carregando...'
                                : 'Escolher da Galeria'}
                            </span>
                          </label>

                          {hasPhoto && (
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(prod.id)}
                              className="text-[#64748B] hover:text-red-600 text-[11px] font-semibold underline px-1 cursor-pointer"
                            >
                              Remover foto
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Nome do Produto */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#0F172A] mb-1 flex items-center gap-1">
                        <Package size={13} className="text-[#2563EB]" />
                        <span>Nome do Produto</span>
                      </label>
                      <input
                        type="text"
                        value={prod.nome}
                        onChange={(e) => handleFieldChange(prod.id, 'nome', e.target.value)}
                        placeholder="Ex: Fone Bluetooth Pro"
                        className="w-full bg-white text-[#0F172A] text-[13px] font-semibold px-3 py-2 rounded-[8px] border border-[#E2E8F0] focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    {/* Link Afiliado Shopee */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#0F172A] mb-1 flex items-center gap-1">
                        <Link size={13} className="text-[#2563EB]" />
                        <span>Link Afiliado (Shopee)</span>
                      </label>
                      <input
                        type="text"
                        value={prod.shopeeLink}
                        onChange={(e) => handleFieldChange(prod.id, 'shopeeLink', e.target.value)}
                        placeholder="https://shopee.com.br/..."
                        className="w-full bg-white text-[#0F172A] text-[12px] px-3 py-2 rounded-[8px] border border-[#E2E8F0] focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    {/* Link WhatsApp por produto (opcional) */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#0F172A] mb-1 flex items-center gap-1">
                        <Link size={13} className="text-[#2563EB]" />
                        <span>Link WhatsApp (opcional)</span>
                      </label>
                      <input
                        type="text"
                        value={prod.whatsappLink || ''}
                        onChange={(e) => handleFieldChange(prod.id, 'whatsappLink', e.target.value)}
                        placeholder="https://wa.me/55DDDNUMERO?text=... ou https://api.whatsapp.com/send?phone=..."
                        className="w-full bg-white text-[#0F172A] text-[12px] px-3 py-2 rounded-[8px] border border-[#E2E8F0] focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-3 border-t border-[#E2E8F0] space-y-2">
              <button
                type="button"
                onClick={handleSaveAll}
                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.97] text-white font-[700] text-[14px] rounded-[12px] py-3 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save size={16} />
                <span>Salvar Todas as Alterações</span>
              </button>

              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-[600] text-[12px] rounded-[10px] py-2 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <LogOut size={13} />
                  <span>Sair do ADM</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {isSiteConfigPopupOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-3">
          <div className="w-full max-w-[420px] bg-white rounded-[22px] border border-[#E2E8F0] shadow-2xl p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-[18px] font-[800] text-[#0F172A]">Configurações do Site</p>
                <p className="text-[13px] text-[#64748B] mt-1">Edite o título, a cor do botão e o texto do rodapé.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsSiteConfigPopupOpen(false)}
                className="text-[#64748B] hover:text-[#0F172A] rounded-full p-2 transition-colors"
                aria-label="Fechar configurações do site"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div className="rounded-[18px] border border-[#E2E8F0] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setActiveConfigSection((prev) => (prev === 'identity' ? null : 'identity'))}
                  className="w-full px-4 py-3 text-left bg-[#F8FAFC] hover:bg-[#F1F5F9] flex items-center justify-between gap-3 transition-colors"
                >
                  <span className="text-[14px] font-[700] text-[#0F172A]">Identidade do site</span>
                  <span className="text-[#64748B]">{activeConfigSection === 'identity' ? '−' : '+'}</span>
                </button>
                {activeConfigSection === 'identity' && (
                  <div className="space-y-4 px-4 pb-4 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#0F172A] mb-1">Título do site</label>
                      <input
                        type="text"
                        value={editableSiteConfig.title}
                        onChange={(e) => handleSiteConfigChange('title', e.target.value)}
                        placeholder="Links | Paulo"
                        className="w-full bg-[#F8FAFC] text-[#0F172A] text-[13px] px-3 py-2 rounded-[12px] border border-[#E2E8F0] focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#0F172A] mb-1">Subtítulo do cabeçalho</label>
                      <input
                        type="text"
                        value={editableSiteConfig.headerSubtitle}
                        onChange={(e) => handleSiteConfigChange('headerSubtitle', e.target.value)}
                        placeholder="Produtos pronta entrega em Goianésia-GO"
                        className="w-full bg-[#F8FAFC] text-[#0F172A] text-[13px] px-3 py-2 rounded-[12px] border border-[#E2E8F0] focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-[18px] border border-[#E2E8F0] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setActiveConfigSection((prev) => (prev === 'location' ? null : 'location'))}
                  className="w-full px-4 py-3 text-left bg-[#F8FAFC] hover:bg-[#F1F5F9] flex items-center justify-between gap-3 transition-colors"
                >
                  <span className="text-[14px] font-[700] text-[#0F172A]">Popup de localização</span>
                  <span className="text-[#64748B]">{activeConfigSection === 'location' ? '−' : '+'}</span>
                </button>
                {activeConfigSection === 'location' && (
                  <div className="space-y-4 px-4 pb-4 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#0F172A] mb-1">Título do popup de localização</label>
                      <input
                        type="text"
                        value={editableSiteConfig.locationPopupTitle}
                        onChange={(e) => handleSiteConfigChange('locationPopupTitle', e.target.value)}
                        placeholder="Você é de Goianésia-GO?"
                        className="w-full bg-[#F8FAFC] text-[#0F172A] text-[13px] px-3 py-2 rounded-[12px] border border-[#E2E8F0] focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#0F172A] mb-1">Frase do popup de localização</label>
                      <textarea
                        rows={3}
                        value={editableSiteConfig.locationPopupDescription}
                        onChange={(e) => handleSiteConfigChange('locationPopupDescription', e.target.value)}
                        placeholder="Assim conseguimos te atender do melhor jeito, seja por aqui pertinho ou pela loja online."
                        className="w-full bg-[#F8FAFC] text-[#0F172A] text-[13px] px-3 py-2 rounded-[12px] border border-[#E2E8F0] focus:outline-none focus:border-[#2563EB] resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#0F172A] mb-1">Texto do botão azul</label>
                      <input
                        type="text"
                        value={editableSiteConfig.locationPopupYesButton}
                        onChange={(e) => handleSiteConfigChange('locationPopupYesButton', e.target.value)}
                        placeholder="Sim, sou daqui"
                        className="w-full bg-[#F8FAFC] text-[#0F172A] text-[13px] px-3 py-2 rounded-[12px] border border-[#E2E8F0] focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#0F172A] mb-1">Texto do botão cinza</label>
                      <input
                        type="text"
                        value={editableSiteConfig.locationPopupNoButton}
                        onChange={(e) => handleSiteConfigChange('locationPopupNoButton', e.target.value)}
                        placeholder="Não, sou de fora"
                        className="w-full bg-[#F8FAFC] text-[#0F172A] text-[13px] px-3 py-2 rounded-[12px] border border-[#E2E8F0] focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#0F172A] mb-1">Texto de status local</label>
                      <input
                        type="text"
                        value={editableSiteConfig.localStatusText}
                        onChange={(e) => handleSiteConfigChange('localStatusText', e.target.value)}
                        placeholder="Cliente de Goianésia-GO"
                        className="w-full bg-[#F8FAFC] text-[#0F172A] text-[13px] px-3 py-2 rounded-[12px] border border-[#E2E8F0] focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#0F172A] mb-1">Texto de status online</label>
                      <input
                        type="text"
                        value={editableSiteConfig.onlineStatusText}
                        onChange={(e) => handleSiteConfigChange('onlineStatusText', e.target.value)}
                        placeholder="loja online"
                        className="w-full bg-[#F8FAFC] text-[#0F172A] text-[13px] px-3 py-2 rounded-[12px] border border-[#E2E8F0] focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-[18px] border border-[#E2E8F0] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setActiveConfigSection((prev) => (prev === 'appearance' ? null : 'appearance'))}
                  className="w-full px-4 py-3 text-left bg-[#F8FAFC] hover:bg-[#F1F5F9] flex items-center justify-between gap-3 transition-colors"
                >
                  <span className="text-[14px] font-[700] text-[#0F172A]">Aparência</span>
                  <span className="text-[#64748B]">{activeConfigSection === 'appearance' ? '−' : '+'}</span>
                </button>
                {activeConfigSection === 'appearance' && (
                  <div className="space-y-4 px-4 pb-4 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#0F172A] mb-1">Cor do botão principal</label>
                      <input
                        type="color"
                        value={editableSiteConfig.primaryButtonColor}
                        onChange={(e) => handleSiteConfigChange('primaryButtonColor', e.target.value)}
                        className="w-full h-10 p-0 border-none rounded-[12px]"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-[18px] border border-[#E2E8F0] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setActiveConfigSection((prev) => (prev === 'footer' ? null : 'footer'))}
                  className="w-full px-4 py-3 text-left bg-[#F8FAFC] hover:bg-[#F1F5F9] flex items-center justify-between gap-3 transition-colors"
                >
                  <span className="text-[14px] font-[700] text-[#0F172A]">Rodapé</span>
                  <span className="text-[#64748B]">{activeConfigSection === 'footer' ? '−' : '+'}</span>
                </button>
                {activeConfigSection === 'footer' && (
                  <div className="space-y-4 px-4 pb-4 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#0F172A] mb-1">Texto do rodapé</label>
                      <input
                        type="text"
                        value={editableSiteConfig.footerText}
                        onChange={(e) => handleSiteConfigChange('footerText', e.target.value)}
                        placeholder="Feito com 💙 para atender melhor você"
                        className="w-full bg-[#F8FAFC] text-[#0F172A] text-[13px] px-3 py-2 rounded-[12px] border border-[#E2E8F0] focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setIsSiteConfigPopupOpen(false)}
                className="flex-1 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] font-[700] text-[13px] rounded-[12px] py-3 transition-colors"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={handleSaveSiteConfigSettings}
                className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-[700] text-[13px] rounded-[12px] py-3 transition-colors"
              >
                Salvar configurações
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteTarget !== null && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 px-3 py-4">
          <div className="w-full max-w-sm bg-white rounded-[22px] p-6 border border-[#E2E8F0] shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-[16px] font-[800] text-[#0F172A] mb-1">Confirmar exclusão</p>
                <p className="text-[13px] text-[#64748B]">
                  Tem certeza que deseja remover este produto do catálogo?
                </p>
              </div>
              <button
                type="button"
                onClick={cancelDeleteProduct}
                className="text-[#64748B] hover:text-[#0F172A] p-2 rounded-full transition-colors"
                aria-label="Fechar confirmação"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={confirmDeleteProduct}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-[700] text-[13px] rounded-[12px] py-3 transition-colors"
              >
                Sim, excluir
              </button>
              <button
                type="button"
                onClick={cancelDeleteProduct}
                className="flex-1 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] font-[700] text-[13px] rounded-[12px] py-3 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
