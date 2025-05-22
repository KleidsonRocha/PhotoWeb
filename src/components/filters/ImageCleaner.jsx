import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button, 
  Slider,
  ButtonGroup,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { styled } from '@mui/material/styles';
import RestoreIcon from '@mui/icons-material/Restore';
import FilterListIcon from '@mui/icons-material/FilterList';
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

function ImageCleaner() {
  const [originalImage, setOriginalImage] = useState(null);
  const [imageMatrix, setImageMatrix] = useState(null);
  const [cleanedImage, setCleanedImage] = useState(null);
  const [orderPosition, setOrderPosition] = useState(4); // Valor médio (mediana) como padrão
  const [filterType, setFilterType] = useState('median');

  const handleImageUpload = (imageFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        const rgbMatrix = processImage(img);
        setImageMatrix(rgbMatrix);
        setCleanedImage(null);
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

  const applyMedianFilter = () => {
    if (!imageMatrix) return;

    const height = imageMatrix.length;
    const width = imageMatrix[0].length;
    const filteredMatrix = [];

    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        const neighborsR = [];
        const neighborsG = [];
        const neighborsB = [];

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const ny = y + dy;
            const nx = x + dx;
            const cy = Math.max(0, Math.min(ny, height - 1));
            const cx = Math.max(0, Math.min(nx, width - 1));
            const [r, g, b] = imageMatrix[cy][cx];
            neighborsR.push(r);
            neighborsG.push(g);
            neighborsB.push(b);
          }
        }

        const medianR = neighborsR.sort((a, b) => a - b)[Math.floor(neighborsR.length / 2)];
        const medianG = neighborsG.sort((a, b) => a - b)[Math.floor(neighborsG.length / 2)];
        const medianB = neighborsB.sort((a, b) => a - b)[Math.floor(neighborsB.length / 2)];

        row.push([medianR, medianG, medianB]);
      }
      filteredMatrix.push(row);
    }

    setCleanedImage(createImageFromMatrix(filteredMatrix));
  };

  const applyOrderFilter = () => {
    if (!imageMatrix) return;

    const height = imageMatrix.length;
    const width = imageMatrix[0].length;
    const filteredMatrix = [];

    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        const neighborsR = [];
        const neighborsG = [];
        const neighborsB = [];

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const ny = y + dy;
            const nx = x + dx;
            const cy = Math.max(0, Math.min(ny, height - 1));
            const cx = Math.max(0, Math.min(nx, width - 1));
            const [r, g, b] = imageMatrix[cy][cx];
            neighborsR.push(r);
            neighborsG.push(g);
            neighborsB.push(b);
          }
        }

        const sortedR = neighborsR.sort((a, b) => a - b);
        const sortedG = neighborsG.sort((a, b) => a - b);
        const sortedB = neighborsB.sort((a, b) => a - b);

        const selectedR = sortedR[Math.min(orderPosition, sortedR.length - 1)];
        const selectedG = sortedG[Math.min(orderPosition, sortedG.length - 1)];
        const selectedB = sortedB[Math.min(orderPosition, sortedB.length - 1)];

        row.push([selectedR, selectedG, selectedB]);
      }
      filteredMatrix.push(row);
    }

    setCleanedImage(createImageFromMatrix(filteredMatrix));
  };

  const applyConservativeSmoothing = () => {
    if (!imageMatrix) return;

    const height = imageMatrix.length;
    const width = imageMatrix[0].length;
    const smoothedMatrix = [];

    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        const neighbors = [];

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const ny = y + dy;
            const nx = x + dx;
            const cy = Math.max(0, Math.min(ny, height - 1));
            const cx = Math.max(0, Math.min(nx, width - 1));
            neighbors.push(imageMatrix[cy][cx]);
          }
        }

        const [r, g, b] = imageMatrix[y][x];
        const maxNeighbor = neighbors.reduce(
          (max, pixel) => [
            Math.max(max[0], pixel[0]),
            Math.max(max[1], pixel[1]),
            Math.max(max[2], pixel[2]),
          ],
          [0, 0, 0]
        );
        const minNeighbor = neighbors.reduce(
          (min, pixel) => [
            Math.min(min[0], pixel[0]),
            Math.min(min[1], pixel[1]),
            Math.min(min[2], pixel[2]),
          ],
          [255, 255, 255]
        );

        const smoothedPixel = [
          Math.max(minNeighbor[0], Math.min(maxNeighbor[0], r)),
          Math.max(minNeighbor[1], Math.min(maxNeighbor[1], g)),
          Math.max(minNeighbor[2], Math.min(maxNeighbor[2], b)),
        ];

        row.push(smoothedPixel);
      }
      smoothedMatrix.push(row);
    }

    setCleanedImage(createImageFromMatrix(smoothedMatrix));
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
        data[index + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas.toDataURL();
  };

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };

  const applySelectedFilter = () => {
    switch (filterType) {
      case 'median':
        applyMedianFilter();
        break;
      case 'order':
        applyOrderFilter();
        break;
      case 'conservative':
        applyConservativeSmoothing();
        break;
      default:
        applyMedianFilter();
    }
  };

  const handleResetImage = () => {
    if (originalImage) {
      const rgbMatrix = processImage(originalImage);
      setImageMatrix(rgbMatrix);
      setCleanedImage(null);
    }
  };

  return (
    <Layout title="Limpeza de Imagem">
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
                    Imagem Limpa
                  </Typography>
                  
                  {cleanedImage ? (
                    <ImageDisplay image={cleanedImage} alt="Imagem Limpa" />
                  ) : (
                    <Box sx={{ 
                      height: 300, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'text.secondary' 
                    }}>
                      {originalImage ? 
                        "Selecione um filtro para aplicar" : 
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
                Configurações de Filtro
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="filter-type-label">Tipo de Filtro</InputLabel>
                <Select
                  labelId="filter-type-label"
                  id="filter-type"
                  value={filterType}
                  label="Tipo de Filtro"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="median">Filtro de Mediana</MenuItem>
                  <MenuItem value="order">Filtro por Ordem</MenuItem>
                  <MenuItem value="conservative">Suavização Conservativa</MenuItem>
                </Select>
              </FormControl>
              
              {filterType === 'order' && (
                <Box sx={{ mb: 3 }}>
                  <Typography gutterBottom>
                    Posição de Ordem: {orderPosition}
                  </Typography>
                  <Slider
                    value={orderPosition}
                    onChange={(_, value) => setOrderPosition(value)}
                    min={0}
                    max={8}
                    marks
                    valueLabelDisplay="auto"
                  />
                  <Typography variant="caption" color="text.secondary">
                    0 = mínimo, 4 = mediana, 8 = máximo
                  </Typography>
                </Box>
              )}
              
              <Button 
                variant="contained" 
                fullWidth 
                startIcon={<FilterListIcon />}
                onClick={applySelectedFilter}
                disabled={!imageMatrix}
                sx={{ mb: 2 }}
              >
                Aplicar Filtro
              </Button>
              
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<RestoreIcon />}
                onClick={handleResetImage}
                disabled={!imageMatrix}
              >
                Resetar Imagem
              </Button>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="body2" color="text.secondary">
                <strong>Filtro de Mediana:</strong> Eficaz para remover ruído do tipo "sal e pimenta" preservando bordas.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <strong>Filtro por Ordem:</strong> Permite selecionar qualquer valor ordenado da vizinhança (mín, máx, etc).
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <strong>Suavização Conservativa:</strong> Substitui pixels ruidosos preservando detalhes finos.
              </Typography>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}

export default ImageCleaner;