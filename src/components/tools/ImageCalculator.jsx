import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button, 
  Slider, 
  TextField,
  ButtonGroup,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import MultiplyIcon from '@mui/icons-material/Close';
import DivideIcon from '@mui/icons-material/LinearScale';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import RestoreIcon from '@mui/icons-material/Restore';
import SaveIcon from '@mui/icons-material/Save';
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

function ImageCalculator() {
  const [originalImage, setOriginalImage] = useState(null);
  const [imageMatrix, setImageMatrix] = useState(null);
  const [displayMatrix, setDisplayMatrix] = useState(null);
  const [currentLayer, setCurrentLayer] = useState('original');
  const [operationValue, setOperationValue] = useState(0);
  const [thresholdValue, setThresholdValue] = useState(128);

  const handleImageUpload = (imageFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        const rgbMatrix = processImage(img);
        setImageMatrix(rgbMatrix);
        setDisplayMatrix(rgbMatrix);
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

  const getLayerImage = (matrix, layer) => {
    if (!matrix || !originalImage) return null;

    const canvas = document.createElement('canvas');
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(originalImage.width, originalImage.height);
    const data = imgData.data;

    for (let y = 0; y < originalImage.height; y++) {
      for (let x = 0; x < originalImage.width; x++) {
        const index = (y * originalImage.width + x) * 4;
        const pixel = matrix[y][x];
        
        if (layer === 'red') {
          data[index] = pixel[0];
          data[index + 1] = 0;
          data[index + 2] = 0;
        } else if (layer === 'green') {
          data[index] = 0;
          data[index + 1] = pixel[1];
          data[index + 2] = 0;
        } else if (layer === 'blue') {
          data[index] = 0;
          data[index + 1] = 0;
          data[index + 2] = pixel[2];
        } else {
          data[index] = pixel[0];
          data[index + 1] = pixel[1];
          data[index + 2] = pixel[2];
        }
        
        data[index + 3] = 255; // alpha
      }
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas.toDataURL();
  };

  const handleOperation = (operation) => {
    if (!imageMatrix) return;

    const newMatrix = imageMatrix.map(row =>
      row.map(pixel => {
        const newPixel = [...pixel];
        for (let i = 0; i < 3; i++) {
          if (operation === 'add') {
            newPixel[i] = Math.min(255, newPixel[i] + operationValue);
          } else if (operation === 'subtract') {
            newPixel[i] = Math.max(0, newPixel[i] - operationValue);
          } else if (operation === 'multiply') {
            newPixel[i] = Math.min(255, Math.round(newPixel[i] * operationValue));
          } else if (operation === 'divide') {
            newPixel[i] = operationValue === 0 ? newPixel[i] : Math.max(0, Math.round(newPixel[i] / operationValue));
          }
        }
        return newPixel;
      })
    );

    setDisplayMatrix(newMatrix);
  };

  const handleThresholding = () => {
    if (!imageMatrix) return;

    const thresholdedMatrix = imageMatrix.map(row =>
      row.map(pixel => {
        const grayscale = Math.floor((pixel[0] + pixel[1] + pixel[2]) / 3);
        const thresholdedValue = grayscale >= thresholdValue ? 255 : 0;
        return [thresholdedValue, thresholdedValue, thresholdedValue];
      })
    );

    setDisplayMatrix(thresholdedMatrix);
  };

  const handleInvert = () => {
    if (!imageMatrix) return;

    const invertedMatrix = imageMatrix.map(row =>
      row.map(pixel => {
        return [
          255 - pixel[0],
          255 - pixel[1],
          255 - pixel[2]
        ];
      })
    );

    setDisplayMatrix(invertedMatrix);
  };

  const handleResetImage = () => {
    if (imageMatrix) {
      setDisplayMatrix(imageMatrix);
      setCurrentLayer('original');
    }
  };

  const handleSaveImage = () => {
    const imageUrl = getLayerImage(displayMatrix, currentLayer);
    if (!imageUrl) return;

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `processed_image_${currentLayer}.png`;
    link.click();
  };

  return (
    <Layout title="Calculadora de Imagem">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <StyledPaper>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <Tabs 
                      value={currentLayer} 
                      onChange={(_, newValue) => setCurrentLayer(newValue)}
                      variant="scrollable"
                      scrollButtons="auto"
                    >
                      <Tab label="Original" value="original" />
                      <Tab label="Vermelho" value="red" />
                      <Tab label="Verde" value="green" />
                      <Tab label="Azul" value="blue" />
                    </Tabs>
                  </Box>
                  
                  {originalImage && displayMatrix ? (
                    <ImageDisplay 
                      image={getLayerImage(displayMatrix, currentLayer)} 
                      alt={`Camada ${currentLayer}`} 
                    />
                  ) : (
                    <ImageUploader onImageUpload={handleImageUpload} />
                  )}
                  
                  {originalImage && displayMatrix && (
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button 
                        startIcon={<SaveIcon />} 
                        variant="outlined" 
                        onClick={handleSaveImage}
                      >
                        Salvar Imagem
                      </Button>
                    </Box>
                  )}
                </StyledPaper>
              </Grid>
            </Grid>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Operações Aritméticas
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>
                  Valor: {operationValue}
                </Typography>
                <Slider
                  value={operationValue}
                  onChange={(_, value) => setOperationValue(value)}
                  min={0}
                  max={255}
                  valueLabelDisplay="auto"
                />
              </Box>
              
              <ButtonGroup variant="contained" fullWidth sx={{ mb: 3 }}>
                <Button 
                  startIcon={<AddIcon />} 
                  onClick={() => handleOperation('add')}
                  disabled={!imageMatrix}
                >
                  Adicionar
                </Button>
                <Button 
                  startIcon={<RemoveIcon />} 
                  onClick={() => handleOperation('subtract')}
                  disabled={!imageMatrix}
                >
                  Subtrair
                </Button>
              </ButtonGroup>
              
              <ButtonGroup variant="contained" fullWidth sx={{ mb: 4 }}>
                <Button 
                  startIcon={<MultiplyIcon />} 
                  onClick={() => handleOperation('multiply')}
                  disabled={!imageMatrix}
                >
                  Multiplicar
                </Button>
                <Button 
                  startIcon={<DivideIcon />} 
                  onClick={() => handleOperation('divide')}
                  disabled={!imageMatrix || operationValue === 0}
                >
                  Dividir
                </Button>
              </ButtonGroup>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Limiarização
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>
                  Limiar: {thresholdValue}
                </Typography>
                <Slider
                  value={thresholdValue}
                  onChange={(_, value) => setThresholdValue(value)}
                  min={0}
                  max={255}
                  valueLabelDisplay="auto"
                />
              </Box>
              
              <Button 
                variant="contained" 
                fullWidth 
                onClick={handleThresholding}
                disabled={!imageMatrix}
                sx={{ mb: 2 }}
              >
                Aplicar Limiarização
              </Button>
              
              <Button 
                variant="contained" 
                color="secondary"
                fullWidth 
                startIcon={<InvertColorsIcon />}
                onClick={handleInvert}
                disabled={!imageMatrix}
                sx={{ mb: 3 }}
              >
                Inverter Cores (NOT)
              </Button>
              
              <Divider sx={{ my: 3 }} />
              
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<RestoreIcon />}
                onClick={handleResetImage}
                disabled={!imageMatrix}
              >
                Resetar Imagem
              </Button>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}

export default ImageCalculator;