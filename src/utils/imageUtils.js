/**
 * Lê um arquivo de imagem da galeria do celular/computador, redimensiona
 * para um tamanho otimizado (max 600x600) e converte para Data URL (Base64 JPEG).
 * Isso garante excelente qualidade nos cards e previne estouro de limite do localStorage.
 */
export function compressGalleryImage(file, maxWidth = 600, maxHeight = 600, quality = 0.8) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('O arquivo selecionado não é uma imagem válida.'));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Manter proporção redimensionando para o tamanho máximo
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        // Limpar e desenhar com boa suavização
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Exportar como JPEG compactado em Base64
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Erro ao carregar a imagem selecionada.'));
      img.src = event.target.result;
    };
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo do dispositivo.'));
    reader.readAsDataURL(file);
  });
}
