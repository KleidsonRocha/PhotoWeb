import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button,
  ButtonGroup,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FlipIcon from '@mui/icons-material/Flip';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SwapVertIcon from '@mui/icons-material/SwapVert';
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

function ImageFlipper() {
  const [originalImage, setOriginalImage] = useState(null);
  const [imageMatrix, setImageMatrix] = useState(null);
  const [flippedImage, setFlippedImage] = useState(null);
  const [flipType, setFlipType] = useState(null);

  const handleImageUpload = (imageFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        const rgbMatrix = processImage(img);
        setImageMatrix(rgbMatrix);
        setFlippedImage(null);
        setFlipType(null);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
  };

  const processImage = (img) => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, img.width, img.height);
    const data = imgData.data;
    const rgbMatrix = [];

    for (let y = 0; y < img.height; y++) {
      const row = [];
      for (let x = 0; x < img.width; x++) {
        const index = (y * img.width + x) * 4;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        row.push([r, g, b]);
      }
      rgbMatrix.push(row);
    }

    return rgbMatrix;
  };

  const flipHorizontally = () => {
    if (!imageMatrix) return;
    
    setFlipType('horizontal');
    const flippedMatrix = imageMatrix.map(row => [...row].reverse());
    setFlippedImage(createImageFromMatrix(flippedMatrix));
  };

  const flipVertically = () => {
    if (!imageMatrix) return;
    
    setFlipType('vertical');
    const flippedMatrix = [...imageMatrix].reverse();
    setFlippedImage(createImageFromMatrix(flippedMatrix));
  };

  const flipBoth = () => {
    if (!imageMatrix) return;
    
    setFlipType('both');
    const flippedMatrix = [...imageMatrix].reverse().map(row => [...row].reverse());
    setFlippedImage(createImageFromMatrix(flippedMatrix));
  };

  const createImageFromMatrix = (matrix) => {
    if (!originalImage) return null;

    const canvas = document.createElement('canvas');
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(originalImage.width, originalImage.height);
    const data = imgData.data;

    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        const index = (y * originalImage.width + x) * 4;
        const [r, g, b] = matrix[y][x];
        data[index] = r;
        data[index + 1] = g;
        data[index + 2] = b;
        data[index + 3] = 255; // Alpha channel
      }
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas.toDataURL();
  };

  const getFlipDescription = () => {
    switch (flipType) {
      case 'horizontal':
        return "A inversão horizontal espelha a imagem da esquerda para a direita, como se estivesse olhando para um espelho.";
      case 'vertical':
        return "A inversão vertical espelha a imagem de cima para baixo, invertendo a orientação vertical.";
      case 'both':
        return "A inversão completa aplica tanto a inversão horizontal quanto a vertical, resultando em uma rotação de 180 graus.";
      default:
        return "Selecione um tipo de inversão para aplicar à imagem.";
    }
  };

  return (
    <Layout title="Inversor de Imagem">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
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
              
              <Grid item xs={12} md={6}>
                <StyledPaper>
                  <Typography variant="h6" gutterBottom>
                    Imagem Invertida
                  </Typography>
                  
                  {flippedImage ? (
                    <ImageDisplay image={flippedImage} alt="Imagem Invertida" />
                  ) : (
                    <Box sx={{ 
                      height: 300, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'text.secondary' 
                    }}>
                      {originalImage ? 
                        "Selecione um tipo de inversão para aplicar" : 
                        "Carregue uma imagem primeiro"}
                    </Box>
                  )}
                </StyledPaper>
              </Grid>
            </Grid>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Tipos de Inversão
              </Typography>
              
              <ButtonGroup 
                orientation="vertical" 
                variant="contained" 
                fullWidth 
                sx={{ mb: 3 }}
              >
                <Button 
                  onClick={flipHorizontally}
                  disabled={!imageMatrix}
                  color={flipType === 'horizontal' ? 'primary' : 'inherit'}
                  startIcon={<SwapHorizIcon />}
                >
                  Inverter Horizontalmente
                </Button>
                <Button 
                  onClick={flipVertically}
                  disabled={!imageMatrix}
                  color={flipType === 'vertical' ? 'primary' : 'inherit'}
                  startIcon={<SwapVertIcon />}
                >
                  Inverter Verticalmente
                </Button>
                <Button 
                  onClick={flipBoth}
                  disabled={!imageMatrix}
                  color={flipType === 'both' ? 'primary' : 'inherit'}
                  startIcon={<FlipIcon />}
                >
                  Inverter Completamente
                </Button>
              </ButtonGroup>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Descrição da Inversão
              </Typography>
              
              <Paper 
                variant="outlined" 
                sx={{ p: 2, bgcolor: 'background.default' }}
              >
                <Typography variant="body2">
                  {getFlipDescription()}
                </Typography>
              </Paper>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  A inversão de imagens é útil para corrigir orientações incorretas, criar efeitos 
                  de espelhamento para design gráfico, ou preparar imagens para impressão em 
                  materiais transparentes. Esta ferramenta permite aplicar inversões horizontais, 
                  verticais ou ambas simultaneamente.
                </Typography>
              </Box>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}

export default ImageFlipper;