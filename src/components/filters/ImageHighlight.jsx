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
import FilterTiltShiftIcon from '@mui/icons-material/FilterTiltShift';
import TuneIcon from '@mui/icons-material/Tune';
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

function ImageHighlight() {
  const [originalImage, setOriginalImage] = useState(null);
  const [imageMatrix, setImageMatrix] = useState(null);
  const [highlightedImage, setHighlightedImage] = useState(null);
  const [currentFilter, setCurrentFilter] = useState(null);

  const handleImageUpload = (imageFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        const rgbMatrix = processImage(img);
        setImageMatrix(rgbMatrix);
        setHighlightedImage(null);
        setCurrentFilter(null);
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

  const applyHighlight = (type) => {
    if (!imageMatrix) return;

    setCurrentFilter(type);
    const height = imageMatrix.length;
    const width = imageMatrix[0].length;
    const highlightedMatrix = [];

    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        const neighbors = [];

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dy === 0 && dx === 0) continue;
            const ny = y + dy;
            const nx = x + dx;
            const cy = Math.max(0, Math.min(ny, height - 1));
            const cx = Math.max(0, Math.min(nx, width - 1));
            neighbors.push(imageMatrix[cy][cx]);
          }
        }

        let newPixel;
        if (type === 'max') {
          newPixel = neighbors.reduce((max, pixel) => [
            Math.max(max[0], pixel[0]),
            Math.max(max[1], pixel[1]),
            Math.max(max[2], pixel[2]),
          ], [0, 0, 0]);
        } else if (type === 'min') {
          newPixel = neighbors.reduce((min, pixel) => [
            Math.min(min[0], pixel[0]),
            Math.min(min[1], pixel[1]),
            Math.min(min[2], pixel[2]),
          ], [255, 255, 255]);
        } else if (type === 'avg') {
          const sum = neighbors.reduce((acc, pixel) => [
            acc[0] + pixel[0],
            acc[1] + pixel[1],
            acc[2] + pixel[2],
          ], [0, 0, 0]);
          newPixel = [
            Math.round(sum[0] / neighbors.length),
            Math.round(sum[1] / neighbors.length),
            Math.round(sum[2] / neighbors.length),
          ];
        }

        row.push(newPixel);
      }
      highlightedMatrix.push(row);
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const [r, g, b] = highlightedMatrix[y][x];
        data[index] = r;
        data[index + 1] = g;
        data[index + 2] = b;
        data[index + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    setHighlightedImage(canvas.toDataURL());
  };

  const getFilterDescription = () => {
    switch (currentFilter) {
      case 'max':
        return "O realce máximo substitui cada pixel pelo valor máximo em sua vizinhança, destacando áreas claras e expandindo regiões brilhantes.";
      case 'min':
        return "O realce mínimo substitui cada pixel pelo valor mínimo em sua vizinhança, destacando áreas escuras e expandindo regiões sombreadas.";
      case 'avg':
        return "O realce médio substitui cada pixel pela média dos valores em sua vizinhança, suavizando a imagem e reduzindo ruídos.";
      default:
        return "Selecione um tipo de realce para aplicar à imagem.";
    }
  };

  return (
    <Layout title="Realce de Imagem">
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
                    Imagem Realçada
                  </Typography>
                  
                  {highlightedImage ? (
                    <ImageDisplay image={highlightedImage} alt="Imagem Realçada" />
                  ) : (
                    <Box sx={{ 
                      height: 300, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'text.secondary' 
                    }}>
                      {originalImage ? 
                        "Selecione um tipo de realce para aplicar" : 
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
                Tipos de Realce
              </Typography>
              
              <ButtonGroup 
                orientation="vertical" 
                variant="contained" 
                fullWidth 
                sx={{ mb: 3 }}
              >
                <Button 
                  onClick={() => applyHighlight('max')}
                  disabled={!imageMatrix}
                  color={currentFilter === 'max' ? 'primary' : 'inherit'}
                  startIcon={<TuneIcon />}
                >
                  Realce Máximo
                </Button>
                <Button 
                  onClick={() => applyHighlight('avg')}
                  disabled={!imageMatrix}
                  color={currentFilter === 'avg' ? 'primary' : 'inherit'}
                  startIcon={<FilterTiltShiftIcon />}
                >
                  Realce Médio
                </Button>
                <Button 
                  onClick={() => applyHighlight('min')}
                  disabled={!imageMatrix}
                  color={currentFilter === 'min' ? 'primary' : 'inherit'}
                  startIcon={<TuneIcon />}
                >
                  Realce Mínimo
                </Button>
              </ButtonGroup>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Descrição do Filtro
              </Typography>
              
              <Paper 
                variant="outlined" 
                sx={{ p: 2, bgcolor: 'background.default' }}
              >
                <Typography variant="body2">
                  {getFilterDescription()}
                </Typography>
              </Paper>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Os filtros de realce são úteis para destacar características específicas em uma imagem, 
                  como bordas, texturas ou regiões de interesse. Cada tipo de realce produz um efeito 
                  diferente, adequado para diferentes aplicações.
                </Typography>
              </Box>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}

export default ImageHighlight;