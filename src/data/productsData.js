// ==============================================================================
// CONFIGURAÇÕES DO VENDEDOR & CATÁLOGO DE PRODUTOS
// Edite os dados abaixo para alterar os produtos exibidos ou o número do WhatsApp.
// ==============================================================================

// Número do WhatsApp com código do país (55) + DDD (62) + Número (sem traços ou espaços)
export const WHATSAPP_NUMERO = "5562984887964";

// Mensagem inicial padronizada para o WhatsApp
export const WHATSAPP_MENSAGEM_TEMPLATE = (nomeProduto) =>
  `Olá! Tenho interesse no produto: ${nomeProduto} 😊`;

// Chave para persistência no localStorage
export const STORAGE_KEY_PRODUTOS = "links_paulo_produtos_v2";
export const STORAGE_KEY_SITE_CONFIG = "links_paulo_site_config_v1";

export const SITE_CONFIG_PADRAO = {
  title: "Links | Paulo",
  headerSubtitle: "Produtos pronta entrega em Goianésia-GO",
  locationPopupTitle: "Você é de Goianésia-GO?",
  locationPopupDescription:
    "Assim conseguimos te atender do melhor jeito, seja por aqui pertinho ou pela loja online.",
  locationPopupYesButton: "Sim, sou daqui",
  locationPopupNoButton: "Não, sou de fora",
  localStatusText: "Cliente de Goianésia-GO",
  onlineStatusText: "loja online",
  primaryButtonColor: "#2563EB",
  footerText: "Feito com 💙 para atender melhor você",
};

export const PRODUTOS_PADRAO = [
  {
    id: 1,
    nome: "Smartwatch i8 Pro Max Ultra",
    imagem: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80",
    shopeeLink: "https://shopee.com.br/search?keyword=smartwatch+i8+pro+max",
    whatsappLink: "",
  },
  {
    id: 2,
    nome: "Fone Bluetooth TWS Pro Premium",
    imagem: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
    shopeeLink: "https://shopee.com.br/search?keyword=fone+bluetooth+tws",
    whatsappLink: "",
  },
  {
    id: 3,
    nome: "Caixa de Som Bluetooth Portátil WaterResist",
    imagem: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80",
    shopeeLink: "https://shopee.com.br/search?keyword=caixa+de+som+bluetooth",
    whatsappLink: "",
  },
  {
    id: 4,
    nome: "Carregador Turbo 35W Dual Type-C",
    imagem: "",
    shopeeLink: "https://shopee.com.br/search?keyword=carregador+turbo+35w",
    whatsappLink: "",
  },
  {
    id: 5,
    nome: "Ring Light LED 10 Polegadas com Tripé",
    imagem: "https://images.unsplash.com/photo-1621600411688-4be93cd68504?auto=format&fit=crop&w=600&q=80",
    shopeeLink: "https://shopee.com.br/search?keyword=ring+light+led+tripe",
    whatsappLink: "",
  },
  {
    id: 6,
    nome: "Mini Câmera de Segurança Wi-Fi HD",
    imagem: "",
    shopeeLink: "https://shopee.com.br/search?keyword=mini+camera+wifi+hd",
    whatsappLink: "",
  },
  {
    id: 7,
    nome: "Controle Bluetooth Gamepad para Celular",
    imagem: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=600&q=80",
    shopeeLink: "https://shopee.com.br/search?keyword=controle+gamepad+bluetooth",
    whatsappLink: "",
  },
  {
    id: 8,
    nome: "Suporte Veicular Magnético com Carregamento Indução",
    imagem: "",
    shopeeLink: "https://shopee.com.br/search?keyword=suporte+veicular+magnetico",
    whatsappLink: "",
  }
];

/**
 * Carrega a configuração do site salva no localStorage ou retorna o padrão.
 */
export function loadSiteConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SITE_CONFIG);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        return {
          ...SITE_CONFIG_PADRAO,
          ...parsed,
        };
      }
    }
  } catch (e) {
    console.error('Erro ao carregar site config do localStorage:', e);
  }
  return SITE_CONFIG_PADRAO;
}

export function saveSiteConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEY_SITE_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Erro ao salvar site config no localStorage:', e);
  }
}

/**
 * Carrega a lista de produtos salva no localStorage ou retorna os produtos padrão.
 */
export function loadProdutos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PRODUTOS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Erro ao carregar produtos do localStorage:', e);
  }
  return PRODUTOS_PADRAO;
}

/**
 * Salva a lista de produtos editada pelo administrador no localStorage.
 */
export function saveProdutos(produtosList) {
  try {
    localStorage.setItem(STORAGE_KEY_PRODUTOS, JSON.stringify(produtosList));
  } catch (e) {
    console.error('Erro ao salvar produtos no localStorage:', e);
  }
}
