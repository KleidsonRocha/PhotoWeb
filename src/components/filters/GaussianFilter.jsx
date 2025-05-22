import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Slider, 
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Layout from '../common/Layout';
import ImageUploader from '../common/ImageUploader';
import ImageDisplay from '../common/ImageDisplay';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const KernelCell = styled(TableCell)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(1),
  fontFamily: 'monospace',
  fontSize: '0.9rem',
}));

function GaussianFilter() {
  const [originalImage, setOriginalImage] = useState(null);
  const [filteredImage, setFilteredImage] = useState(null);
  const [filterSize, setFilterSize] = useState(3);
  const [sigma, setSigma] = useState(1);
  const [kernel, setKernel] = useState([]);
  const [kernelBytes, setKernelBytes] = useState([]);

  useEffect(() => {
    if (originalImage) {
      applyGaussianFilter();
    }
  }, [originalImage, filterSize, sigma]);

  const handleImageUpload = (imageFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
  };

  const generateGaussianKernel = (size, sigma) => {
    const kernel = [];
    const center = Math.floor(size / 2);
    let sum = 0;

    for (let y = 0; y < size; y++) {
      const row = [];
      for (let x = 0; x < size; x++) {
        const exponent = -((x - center) ** 2 + (y - center) ** 2) / (2 * sigma ** 2);
        const value = Math.exp(exponent);
        row.push(value);
        sum += value;
      }
      kernel.push(row);
    }

    // Normalizar o kernel para que a soma dos valores seja 1
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        kernel[y][x] /= sum;
      }
    }

    // Converter os valores do kernel para bytes (0-255)
    const kernelBytes = kernel.map(row =>
      row.map(value => Math.round(value * 255))
    );

    setKernel(kernel);
    setKernelBytes(kernelBytes);
    return kernel;
  };

  const applyGaussianFilter = () => {
    if (!originalImage) return;

    const kernel = generateGaussianKernel(filterSize, sigma);
    const canvas = document.createElement('canvas');
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(originalImage, 0, 0);

    const imgData = ctx.getImageData(0, 0, originalImage.width, originalImage.height);
    const data = imgData.data;
    const width = originalImage.width;
    const height = originalImage.height;

    const outputData = new Uint8ClampedArray(data);

    const offset = Math.floor(filterSize / 2);

    for (let y = offset; y < height - offset; y++) {
      for (let x = offset; x < width - offset; x++) {
        let rSum = 0, gSum = 0, bSum = 0;

        for (let ky = -offset; ky <= offset; ky++) {
          for (let kx = -offset; kx <= offset; kx++) {
            const pixelIndex = ((y + ky) * width + (x + kx)) * 4;
            const weight = kernel[ky + offset][kx + offset];

            rSum += data[pixelIndex] * weight;
            gSum += data[pixelIndex + 1] * weight;
            bSum += data[pixelIndex + 2] * weight;
          }
        }

        const index = (y * width + x) * 4;
        outputData[index] = rSum;
        outputData[index + 1] = gSum;
        outputData[index + 2] = bSum;
      }
    }

    ctx.putImageData(new ImageData(outputData, width, height), 0, 0);
    setFilteredImage(canvas.toDataURL());
  };

  const handleFilterSizeChange = (event, newValue) => {
    // Garantir que o tamanho do filtro seja sempre ímpar
    const value = newValue % 2 === 0 ? newValue + 1 : newValue;
    setFilterSize(value);
  };

  return (
    <Layout title="Filtro Gaussiano">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Configurações do Filtro
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <Typography gutterBottom>
                  Tamanho do Filtro: {filterSize}x{filterSize}
                </Typography>
                <Slider
                  value={filterSize}
                  onChange={handleFilterSizeChange}
                  min={3}
                  max={11}
                  step={2}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>
              
              <Box sx={{ mb: 4 }}>
                <Typography gutterBottom>
                  Desvio Padrão (σ): {sigma}
                </Typography>
                <Slider
                  value={sigma}
                  onChange={(_, value) => setSigma(value)}
                  min={0.1}
                  max={5}
                  step={0.1}
                  valueLabelDisplay="auto"
                />
              </Box>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Máscara (Kernel) em Bytes
              </Typography>
              
              {kernelBytes.length > 0 && (
                <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
                  <Table size="small">
                    <TableBody>
                      {kernelBytes.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <KernelCell key={cellIndex}>
                              {cell}
                            </KernelCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </StyledPaper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <StyledPaper>
                  <Typography variant="h6" gutterBottom>
                    Imagem Original
                  </Typography>
                  {originalImage ? (
                    <ImageDisplay image={originalImage} alt="Imagem Original" />
                  ) : (
                    <ImageUploader onImageUpload={handleImageUpload} />
                  )}
                </StyledPaper>
              </Grid>
              
              <Grid item xs={12}>
                <StyledPaper>
                  <Typography variant="h6" gutterBottom>
                    Imagem Filtrada
                  </Typography>
                  {filteredImage ? (
                    <ImageDisplay image={filteredImage} alt="Imagem Filtrada" />
                  ) : (
                    <Box sx={{ 
                      height: 300, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'text.secondary' 
                    }}>
                      {originalImage ? 
                        "Processando..." : 
                        "Carregue uma imagem primeiro"}
                    </Box>
                  )}
                </StyledPaper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}

export default GaussianFilter;