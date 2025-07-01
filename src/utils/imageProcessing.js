// Funções utilitárias para processamento de imagem

// Converter para escala de cinza
export const toGrayscale = (imageData) => {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg;     // R
    data[i + 1] = avg; // G
    data[i + 2] = avg; // B
  }
  return imageData;
};

// Aplicar filtro gaussiano para redução de ruído
export const applyGaussianBlur = (imageData, width, height) => {
  const kernel = [
    [1/16, 2/16, 1/16],
    [2/16, 4/16, 2/16],
    [1/16, 2/16, 1/16]
  ];
  
  return applyConvolution(imageData, width, height, kernel);
};

// Aplicar convolução com um kernel específico
export const applyConvolution = (imageData, width, height, kernel) => {
  const data = imageData.data;
  const output = new Uint8ClampedArray(data.length);
  const kernelSize = kernel.length;
  const halfKernelSize = Math.floor(kernelSize / 2);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      let r = 0, g = 0, b = 0;

      // Aplicar convolução
      for (let ky = 0; ky < kernelSize; ky++) {
        for (let kx = 0; kx < kernelSize; kx++) {
          const pixelY = Math.min(Math.max(y + ky - halfKernelSize, 0), height - 1);
          const pixelX = Math.min(Math.max(x + kx - halfKernelSize, 0), width - 1);
          const pixelIdx = (pixelY * width + pixelX) * 4;
          const weight = kernel[ky][kx];
          
          r += data[pixelIdx] * weight;
          g += data[pixelIdx + 1] * weight;
          b += data[pixelIdx + 2] * weight;
        }
      }

      output[idx] = r;
      output[idx + 1] = g;
      output[idx + 2] = b;
      output[idx + 3] = data[idx + 3]; // Manter o alpha original
    }
  }

  const result = new ImageData(output, width, height);
  return result;
};

// Aplicar detecção de bordas usando Sobel
export const applySobel = (image) => {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, image.width, image.height);
  
  // Converter para escala de cinza e aplicar blur para reduzir ruído
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  imageData = toGrayscale(imageData);
  imageData = applyGaussianBlur(imageData, canvas.width, canvas.height);
  ctx.putImageData(imageData, 0, 0);
  
  // Definir operador Sobel
  const sobelX = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
  ];
  
  const sobelY = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1]
  ];
  
  // Aplicar Sobel X e Y
  const gx = applyConvolution(imageData, canvas.width, canvas.height, sobelX);
  const gy = applyConvolution(imageData, canvas.width, canvas.height, sobelY);
  
  // Combinar os resultados
  const data = imageData.data;
  const gxData = gx.data;
  const gyData = gy.data;
  const output = new Uint8ClampedArray(data.length);
  
  for (let i = 0; i < data.length; i += 4) {
    // Calcular a magnitude do gradiente
    const gxVal = gxData[i];
    const gyVal = gyData[i];
    const magnitude = Math.sqrt(gxVal * gxVal + gyVal * gyVal);
    
    // Normalizar para 0-255
    const val = Math.min(255, magnitude);
    
    output[i] = val;
    output[i + 1] = val;
    output[i + 2] = val;
    output[i + 3] = 255; // Alpha
  }
  
  const resultImageData = new ImageData(output, canvas.width, canvas.height);
  ctx.putImageData(resultImageData, 0, 0);
  
  return {
    processedImageData: canvas.toDataURL(),
    kernel: {
      x: sobelX,
      y: sobelY,
      name: 'Operador Sobel'
    }
  };
};

// Aplicar detecção de bordas usando Prewitt
export const applyPrewitt = (image) => {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, image.width, image.height);
  
  // Converter para escala de cinza e aplicar blur para reduzir ruído
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  imageData = toGrayscale(imageData);
  imageData = applyGaussianBlur(imageData, canvas.width, canvas.height);
  ctx.putImageData(imageData, 0, 0);
  
  // Definir operador Prewitt
  const prewittX = [
    [-1, 0, 1],
    [-1, 0, 1],
    [-1, 0, 1]
  ];
  
  const prewittY = [
    [-1, -1, -1],
    [0, 0, 0],
    [1, 1, 1]
  ];
  
  // Aplicar Prewitt X e Y
  const gx = applyConvolution(imageData, canvas.width, canvas.height, prewittX);
  const gy = applyConvolution(imageData, canvas.width, canvas.height, prewittY);
  
  // Combinar os resultados
  const data = imageData.data;
  const gxData = gx.data;
  const gyData = gy.data;
  const output = new Uint8ClampedArray(data.length);
  
  for (let i = 0; i < data.length; i += 4) {
    // Calcular a magnitude do gradiente
    const gxVal = gxData[i];
    const gyVal = gyData[i];
    const magnitude = Math.sqrt(gxVal * gxVal + gyVal * gyVal);
    
    // Normalizar para 0-255
    const val = Math.min(255, magnitude);
    
    output[i] = val;
    output[i + 1] = val;
    output[i + 2] = val;
    output[i + 3] = 255; // Alpha
  }
  
  const resultImageData = new ImageData(output, canvas.width, canvas.height);
  ctx.putImageData(resultImageData, 0, 0);
  
  return {
    processedImageData: canvas.toDataURL(),
    kernel: {
      x: prewittX,
      y: prewittY,
      name: 'Operador Prewitt'
    }
  };
};

// Aplicar detecção de bordas usando Laplaciano
export const applyLaplacian = (image) => {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, image.width, image.height);
  
  // Converter para escala de cinza e aplicar blur para reduzir ruído
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  imageData = toGrayscale(imageData);
  imageData = applyGaussianBlur(imageData, canvas.width, canvas.height);
  ctx.putImageData(imageData, 0, 0);
  
  // Definir operador Laplaciano
  // Existem várias variantes do Laplaciano, esta é uma das mais comuns
  const laplacian = [
    [0, 1, 0],
    [1, -4, 1],
    [0, 1, 0]
  ];
  
  // Variante alternativa do Laplaciano (8-vizinhos)
  // const laplacian = [
  //   [1, 1, 1],
  //   [1, -8, 1],
  //   [1, 1, 1]
  // ];
  
  // Aplicar Laplaciano
  const result = applyConvolution(imageData, canvas.width, canvas.height, laplacian);
  
  // Para o Laplaciano, frequentemente invertemos os valores para melhor visualização
  // pois o Laplaciano detecta as transições como valores negativos
  const data = result.data;
  for (let i = 0; i < data.length; i += 4) {
    // Inverter e normalizar
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }
  
  ctx.putImageData(result, 0, 0);
  
  return {
    processedImageData: canvas.toDataURL(),
    kernel: {
      matrix: laplacian,
      name: 'Operador Laplaciano'
    }
  };
};

// Função adicional: Aplicar detecção de bordas usando Laplaciano do Gaussiano (LoG)
export const applyLoG = (image, sigma = 1.4) => {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, image.width, image.height);
  
  // Converter para escala de cinza
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  imageData = toGrayscale(imageData);
  ctx.putImageData(imageData, 0, 0);
  
  // Tamanho do kernel baseado em sigma (geralmente 2*ceil(3*sigma) + 1)
  const kernelSize = 2 * Math.ceil(3 * sigma) + 1;
  const halfSize = Math.floor(kernelSize / 2);
  
  // Criar kernel LoG
  const logKernel = [];
  let sum = 0;
  
  for (let y = 0; y < kernelSize; y++) {
    const row = [];
    for (let x = 0; x < kernelSize; x++) {
      const xDistance = x - halfSize;
      const yDistance = y - halfSize;
      const distance2 = xDistance * xDistance + yDistance * yDistance;
      const sigma2 = sigma * sigma;
      
      // Fórmula do Laplaciano do Gaussiano
      const value = -1 * (1 - distance2 / (2 * sigma2)) * Math.exp(-distance2 / (2 * sigma2));
      row.push(value);
      sum += value;
    }
    logKernel.push(row);
  }
  
  // Normalizar o kernel para que a soma seja zero
  // Isso é importante para o LoG
  if (Math.abs(sum) > 0.0001) {
    for (let y = 0; y < kernelSize; y++) {
      for (let x = 0; x < kernelSize; x++) {
        logKernel[y][x] -= sum / (kernelSize * kernelSize);
      }
    }
  }
  
  // Aplicar o kernel LoG
  const result = applyConvolution(imageData, canvas.width, canvas.height, logKernel);
  
  // Ajustar contraste para melhor visualização
  const data = result.data;
  let min = Infinity;
  let max = -Infinity;
  
  // Encontrar valores mínimo e máximo
  for (let i = 0; i < data.length; i += 4) {
    min = Math.min(min, data[i]);
    max = Math.max(max, data[i]);
  }
  
  const range = max - min;
  
  // Normalizar para o intervalo 0-255
  for (let i = 0; i < data.length; i += 4) {
    const normalized = range === 0 ? 0 : Math.round(255 * (data[i] - min) / range);
    data[i] = normalized;
    data[i + 1] = normalized;
    data[i + 2] = normalized;
  }
  
  ctx.putImageData(result, 0, 0);
  
  return {
    processedImageData: canvas.toDataURL(),
    kernel: {
      matrix: logKernel,
      name: 'Laplaciano do Gaussiano (LoG)'
    }
  };
};

// Função auxiliar para criar um elemento estruturante
const createStructuringElement = (size) => {
  // Garantir que o tamanho é ímpar
  const kernelSize = size % 2 === 0 ? size + 1 : size;
  const radius = Math.floor(kernelSize / 2);
  
  // Criar matriz quadrada preenchida com 1s
  const kernel = [];
  for (let y = 0; y < kernelSize; y++) {
    const row = [];
    for (let x = 0; x < kernelSize; x++) {
      // Você pode modificar isso para criar diferentes formas de elementos estruturantes
      // Por exemplo, um disco em vez de um quadrado
      row.push(1);
    }
    kernel.push(row);
  }
  
  return { kernel, radius };
};

// Função para aplicar dilatação
export const applyDilate = (img, kernelSize = 3, iterations = 1) => {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  
  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  // Criar elemento estruturante
  const { kernel, radius } = createStructuringElement(kernelSize);
  
  // Aplicar dilatação o número de vezes especificado
  for (let iter = 0; iter < iterations; iter++) {
    imgData = dilateOperation(imgData, kernel, radius);
    
    // Se não for a última iteração, atualizar o canvas para a próxima iteração
    if (iter < iterations - 1) {
      ctx.putImageData(imgData, 0, 0);
      imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
  }
  
  // Atualizar o canvas com a imagem final
  ctx.putImageData(imgData, 0, 0);
  
  return {
    processedImageData: canvas.toDataURL(),
    kernel
  };
};

// Função para aplicar erosão
export const applyErode = (img, kernelSize = 3, iterations = 1) => {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  
  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  // Criar elemento estruturante
  const { kernel, radius } = createStructuringElement(kernelSize);
  
  // Aplicar erosão o número de vezes especificado
  for (let iter = 0; iter < iterations; iter++) {
    imgData = erodeOperation(imgData, kernel, radius);
    
    // Se não for a última iteração, atualizar o canvas para a próxima iteração
    if (iter < iterations - 1) {
      ctx.putImageData(imgData, 0, 0);
      imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
  }
  
  // Atualizar o canvas com a imagem final
  ctx.putImageData(imgData, 0, 0);
  
  return {
    processedImageData: canvas.toDataURL(),
    kernel
  };
};

// Função para aplicar abertura (erosão seguida de dilatação)
export const applyOpening = (img, kernelSize = 3, iterations = 1) => {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  
  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  // Criar elemento estruturante
  const { kernel, radius } = createStructuringElement(kernelSize);
  
  // Aplicar erosão
  for (let iter = 0; iter < iterations; iter++) {
    imgData = erodeOperation(imgData, kernel, radius);
    ctx.putImageData(imgData, 0, 0);
    imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }
  
  // Aplicar dilatação
  for (let iter = 0; iter < iterations; iter++) {
    imgData = dilateOperation(imgData, kernel, radius);
    
    // Se não for a última iteração, atualizar o canvas para a próxima iteração
    if (iter < iterations - 1) {
      ctx.putImageData(imgData, 0, 0);
      imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
  }
  
  // Atualizar o canvas com a imagem final
  ctx.putImageData(imgData, 0, 0);
  
  return {
    processedImageData: canvas.toDataURL(),
    kernel
  };
};

// Função para aplicar fechamento (dilatação seguida de erosão)
export const applyClosing = (img, kernelSize = 3, iterations = 1) => {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  
  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  // Criar elemento estruturante
  const { kernel, radius } = createStructuringElement(kernelSize);
  
  // Aplicar dilatação
  for (let iter = 0; iter < iterations; iter++) {
    imgData = dilateOperation(imgData, kernel, radius);
    ctx.putImageData(imgData, 0, 0);
    imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }
  
  // Aplicar erosão
  for (let iter = 0; iter < iterations; iter++) {
    imgData = erodeOperation(imgData, kernel, radius);
    
    // Se não for a última iteração, atualizar o canvas para a próxima iteração
    if (iter < iterations - 1) {
      ctx.putImageData(imgData, 0, 0);
      imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
  }
  
  // Atualizar o canvas com a imagem final
  ctx.putImageData(imgData, 0, 0);
  
  return {
    processedImageData: canvas.toDataURL(),
    kernel
  };
};

// Implementação da operação de dilatação
const dilateOperation = (imgData, kernel, radius) => {
  const { width, height, data } = imgData;
  const output = new ImageData(width, height);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Para cada pixel, encontrar o valor máximo na vizinhança
      let maxR = 0, maxG = 0, maxB = 0;
      
      for (let ky = -radius; ky <= radius; ky++) {
        for (let kx = -radius; kx <= radius; kx++) {
          // Verificar se o elemento estruturante tem valor 1 nesta posição
          if (kernel[ky + radius][kx + radius] === 1) {
            const ny = Math.max(0, Math.min(y + ky, height - 1));
            const nx = Math.max(0, Math.min(x + kx, width - 1));
            const idx = (ny * width + nx) * 4;
            
            maxR = Math.max(maxR, data[idx]);
            maxG = Math.max(maxG, data[idx + 1]);
            maxB = Math.max(maxB, data[idx + 2]);
          }
        }
      }
      
      // Definir o pixel de saída com os valores máximos encontrados
      const outIdx = (y * width + x) * 4;
      output.data[outIdx] = maxR;
      output.data[outIdx + 1] = maxG;
      output.data[outIdx + 2] = maxB;
      output.data[outIdx + 3] = 255; // Alpha sempre 255
    }
  }
  
  return output;
};

// Implementação da operação de erosão
const erodeOperation = (imgData, kernel, radius) => {
  const { width, height, data } = imgData;
  const output = new ImageData(width, height);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Para cada pixel, encontrar o valor mínimo na vizinhança
      let minR = 255, minG = 255, minB = 255;
      
      for (let ky = -radius; ky <= radius; ky++) {
        for (let kx = -radius; kx <= radius; kx++) {
          // Verificar se o elemento estruturante tem valor 1 nesta posição
          if (kernel[ky + radius][kx + radius] === 1) {
            const ny = Math.max(0, Math.min(y + ky, height - 1));
            const nx = Math.max(0, Math.min(x + kx, width - 1));
            const idx = (ny * width + nx) * 4;
            
            minR = Math.min(minR, data[idx]);
            minG = Math.min(minG, data[idx + 1]);
            minB = Math.min(minB, data[idx + 2]);
          }
        }
      }
      
      // Definir o pixel de saída com os valores mínimos encontrados
      const outIdx = (y * width + x) * 4;
      output.data[outIdx] = minR;
      output.data[outIdx + 1] = minG;
      output.data[outIdx + 2] = minB;
      output.data[outIdx + 3] = 255; // Alpha sempre 255
    }
  }
  
  return output;
};

// Função para ajustar brilho da imagem
export const adjustBrightness = (imageData, brightness) => {
  const data = imageData.data;
  const output = new Uint8ClampedArray(data.length);
  
  for (let i = 0; i < data.length; i += 4) {
    output[i] = Math.max(0, Math.min(255, data[i] + brightness));     // R
    output[i + 1] = Math.max(0, Math.min(255, data[i + 1] + brightness)); // G
    output[i + 2] = Math.max(0, Math.min(255, data[i + 2] + brightness)); // B
    output[i + 3] = data[i + 3]; // Alpha
  }
  
  return new ImageData(output, imageData.width, imageData.height);
};

// Função para ajustar contraste da imagem
export const adjustContrast = (imageData, contrast) => {
  const data = imageData.data;
  const output = new Uint8ClampedArray(data.length);
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  
  for (let i = 0; i < data.length; i += 4) {
    output[i] = Math.max(0, Math.min(255, factor * (data[i] - 128) + 128));     // R
    output[i + 1] = Math.max(0, Math.min(255, factor * (data[i + 1] - 128) + 128)); // G
    output[i + 2] = Math.max(0, Math.min(255, factor * (data[i + 2] - 128) + 128)); // B
    output[i + 3] = data[i + 3]; // Alpha
  }
  
  return new ImageData(output, imageData.width, imageData.height);
};

// Função para ajustar saturação da imagem
export const adjustSaturation = (imageData, saturation) => {
  const data = imageData.data;
  const output = new Uint8ClampedArray(data.length);
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Converter para escala de cinza
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    
    // Aplicar saturação
    output[i] = Math.max(0, Math.min(255, gray + saturation * (r - gray)));
    output[i + 1] = Math.max(0, Math.min(255, gray + saturation * (g - gray)));
    output[i + 2] = Math.max(0, Math.min(255, gray + saturation * (b - gray)));
    output[i + 3] = data[i + 3]; // Alpha
  }
  
  return new ImageData(output, imageData.width, imageData.height);
};

// Função para inverter cores da imagem
export const invertColors = (imageData) => {
  const data = imageData.data;
  const output = new Uint8ClampedArray(data.length);
  
  for (let i = 0; i < data.length; i += 4) {
    output[i] = 255 - data[i];     // R
    output[i + 1] = 255 - data[i + 1]; // G
    output[i + 2] = 255 - data[i + 2]; // B
    output[i + 3] = data[i + 3]; // Alpha
  }
  
  return new ImageData(output, imageData.width, imageData.height);
};

// Função para aplicar filtro sépia
export const applySepia = (imageData) => {
  const data = imageData.data;
  const output = new Uint8ClampedArray(data.length);
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    output[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));     // R
    output[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168)); // G
    output[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131)); // B
    output[i + 3] = data[i + 3]; // Alpha
  }
  
  return new ImageData(output, imageData.width, imageData.height);
};

// Função para aplicar filtro de desfoque (blur) simples
export const applySimpleBlur = (imageData, radius = 1) => {
  const { width, height, data } = imageData;
  const output = new Uint8ClampedArray(data.length);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, count = 0;
      
      // Calcular a média dos pixels na vizinhança
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const ny = Math.max(0, Math.min(y + dy, height - 1));
          const nx = Math.max(0, Math.min(x + dx, width - 1));
          const idx = (ny * width + nx) * 4;
          
          r += data[idx];
          g += data[idx + 1];
          b += data[idx + 2];
          count++;
        }
      }
      
      const idx = (y * width + x) * 4;
      output[idx] = r / count;
      output[idx + 1] = g / count;
      output[idx + 2] = b / count;
      output[idx + 3] = data[idx + 3]; // Alpha
    }
  }
  
  return new ImageData(output, width, height);
};

// Função para aplicar filtro de nitidez (sharpen)
export const applySharpen = (imageData) => {
  const sharpenKernel = [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0]
  ];
  
  return applyConvolution(imageData, imageData.width, imageData.height, sharpenKernel);
};

// Função para rotacionar imagem
export const rotateImage = (image, angle) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Calcular novas dimensões após rotação
  const radians = (angle * Math.PI) / 180;
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));
  
  const newWidth = Math.ceil(image.width * cos + image.height * sin);
  const newHeight = Math.ceil(image.width * sin + image.height * cos);
  
  canvas.width = newWidth;
  canvas.height = newHeight;
  
  // Mover para o centro e rotacionar
  ctx.translate(newWidth / 2, newHeight / 2);
  ctx.rotate(radians);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);
  
  return canvas.toDataURL();
};

// Função para espelhar imagem horizontalmente
export const flipHorizontal = (image) => {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  
  ctx.scale(-1, 1);
  ctx.drawImage(image, -image.width, 0);
  
  return canvas.toDataURL();
};

// Função para espelhar imagem verticalmente
export const flipVertical = (image) => {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  
  ctx.scale(1, -1);
  ctx.drawImage(image, 0, -image.height);
  
  return canvas.toDataURL();
};

// Função para redimensionar imagem
export const resizeImage = (image, newWidth, newHeight) => {
  const canvas = document.createElement('canvas');
  canvas.width = newWidth;
  canvas.height = newHeight;
  const ctx = canvas.getContext('2d');
  
  ctx.drawImage(image, 0, 0, newWidth, newHeight);
  
  return canvas.toDataURL();
};

// Função para aplicar filtro de emboss (relevo)
export const applyEmboss = (imageData) => {
  const embossKernel = [
    [-2, -1, 0],
    [-1, 1, 1],
    [0, 1, 2]
  ];
  
  return applyConvolution(imageData, imageData.width, imageData.height, embossKernel);
};

// Função para aplicar filtro de detecção de bordas simples
export const applyEdgeDetection = (imageData) => {
  const edgeKernel = [
    [-1, -1, -1],
    [-1, 8, -1],
    [-1, -1, -1]
  ];
  
  return applyConvolution(imageData, imageData.width, imageData.height, edgeKernel);
};

// Função para aplicar threshold (binarização)
export const applyThreshold = (imageData, threshold = 128) => {
  const data = imageData.data;
  const output = new Uint8ClampedArray(data.length);
  
  for (let i = 0; i < data.length; i += 4) {
    // Converter para escala de cinza primeiro
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const value = gray > threshold ? 255 : 0;
    
    output[i] = value;     // R
    output[i + 1] = value; // G
    output[i + 2] = value; // B
    output[i + 3] = data[i + 3]; // Alpha
  }
  
  return new ImageData(output, imageData.width, imageData.height);
};

// Função para aplicar filtro de ruído (noise)
export const addNoise = (imageData, intensity = 50) => {
  const data = imageData.data;
  const output = new Uint8ClampedArray(data.length);
  
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * intensity * 2;
    
    output[i] = Math.max(0, Math.min(255, data[i] + noise));     // R
    output[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // G
    output[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // B
    output[i + 3] = data[i + 3]; // Alpha
  }
  
  return new ImageData(output, imageData.width, imageData.height);
};

// Função para aplicar filtro de mediana (para redução de ruído)
export const applyMedianFilter = (imageData, radius = 1) => {
  const { width, height, data } = imageData;
  const output = new Uint8ClampedArray(data.length);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const rValues = [], gValues = [], bValues = [];
      
      // Coletar valores dos pixels na vizinhança
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const ny = Math.max(0, Math.min(y + dy, height - 1));
          const nx = Math.max(0, Math.min(x + dx, width - 1));
          const idx = (ny * width + nx) * 4;
          
          rValues.push(data[idx]);
          gValues.push(data[idx + 1]);
          bValues.push(data[idx + 2]);
        }
      }
      
      // Ordenar e pegar a mediana
      rValues.sort((a, b) => a - b);
      gValues.sort((a, b) => a - b);
      bValues.sort((a, b) => a - b);
      
      const medianIndex = Math.floor(rValues.length / 2);
      const idx = (y * width + x) * 4;
      
      output[idx] = rValues[medianIndex];
      output[idx + 1] = gValues[medianIndex];
      output[idx + 2] = bValues[medianIndex];
      output[idx + 3] = data[idx + 3]; // Alpha
    }
  }
  
  return new ImageData(output, width, height);
};

// Função para equalização de histograma
export const equalizeHistogram = (imageData) => {
  const data = imageData.data;
  const output = new Uint8ClampedArray(data.length);
  const histogram = new Array(256).fill(0);
  const totalPixels = imageData.width * imageData.height;
  
  // Calcular histograma para escala de cinza
  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    histogram[gray]++;
  }
  
  // Calcular função de distribuição cumulativa
  const cdf = new Array(256);
  cdf[0] = histogram[0];
  for (let i = 1; i < 256; i++) {
    cdf[i] = cdf[i - 1] + histogram[i];
  }
  
  // Normalizar CDF
  const cdfMin = cdf.find(val => val > 0);
  for (let i = 0; i < 256; i++) {
    cdf[i] = Math.round(((cdf[i] - cdfMin) / (totalPixels - cdfMin)) * 255);
  }
  
  // Aplicar equalização
  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    const equalizedValue = cdf[gray];
    
    // Manter as proporções de cor originais
    const factor = equalizedValue / (gray || 1);
    
    output[i] = Math.max(0, Math.min(255, data[i] * factor));     // R
    output[i + 1] = Math.max(0, Math.min(255, data[i + 1] * factor)); // G
    output[i + 2] = Math.max(0, Math.min(255, data[i + 2] * factor)); // B
    output[i + 3] = data[i + 3]; // Alpha
  }
  
  return new ImageData(output, imageData.width, imageData.height);
};

// Função auxiliar para aplicar filtros que requerem ImageData a partir de uma imagem
export const applyImageDataFilter = (image, filterFunction, ...args) => {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  const filteredImageData = filterFunction(imageData, ...args);
  ctx.putImageData(filteredImageData, 0, 0);
  
  return canvas.toDataURL();
};

