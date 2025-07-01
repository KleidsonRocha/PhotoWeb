import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Button, 
  ButtonGroup, 
  Paper, 
  Slider,
  FormControl,
  FormLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Layout from '../common/Layout';
import ImageUploader from '../common/ImageUploader';
import ImageDisplay from '../common/ImageDisplay';
import { 
  adjustBrightness, 
  adjustContrast, 
  adjustSaturation, 
  invertColors,
  applySepia,
  applyImageDataFilter
} from '../../utils/imageProcessing';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

const ControlPanel = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

function ImageEnhancer() {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(1);

  const handleImageUpload = (imageFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setProcessedImage(null);
        // Reset controls
        setBrightness(0);
        setContrast(0);
        setSaturation(1);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
  };

  const applyBrightnessFilter = () => {
    if (!originalImage) return;
    const result = applyImageDataFilter(originalImage, adjustBrightness, brightness);
    setProcessedImage(result);
  };

  const applyContrastFilter = () => {
    if (!originalImage) return;
    const result = applyImageDataFilter(originalImage, adjustContrast, contrast);
    setProcessedImage(result);
  };

  const applySaturationFilter = () => {
    if (!originalImage) return;
    const result = applyImageDataFilter(originalImage, adjustSaturation, saturation);
    setProcessedImage(result);
  };

  const applyInvertFilter = () => {
    if (!originalImage) return;
    const result = applyImageDataFilter(originalImage, invertColors);
    setProcessedImage(result);
  };

  const applySepiaFilter = () => {
    if (!originalImage) return;
    const result = applyImageDataFilter(originalImage, applySepia);
    setProcessedImage(result);
  };

  const resetImage = () => {
    setProcessedImage(null);
    setBrightness(0);
    setContrast(0);
    setSaturation(1);
  };

  return (
    <Layout title="Melhoramento de Imagem">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Controles */}
          <Grid item xs={12}>
            <ControlPanel>
              <Typography variant="h6" gutterBottom>
                Controles de Ajuste
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <FormLabel>Brilho: {brightness}</FormLabel>
                    <Slider
                      value={brightness}
                      onChange={(e, value) => setBrightness(value)}
                      min={-100}
                      max={100}
                      step={1}
                      disabled={!originalImage}
                    />
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={applyBrightnessFilter}
                      disabled={!originalImage}
                      sx={{ mt: 1 }}
                    >
                      Aplicar Brilho
                    </Button>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <FormLabel>Contraste: {contrast}</FormLabel>
                    <Slider
                      value={contrast}
                      onChange={(e, value) => setContrast(value)}
                      min={-100}
                      max={100}
                      step={1}
                      disabled={!originalImage}
                    />
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={applyContrastFilter}
                      disabled={!originalImage}
                      sx={{ mt: 1 }}
                    >
                      Aplicar Contraste
                    </Button>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <FormLabel>Saturação: {saturation.toFixed(1)}</FormLabel>
                    <Slider
                      value={saturation}
                      onChange={(e, value) => setSaturation(value)}
                      min={0}
                      max={3}
                      step={0.1}
                      disabled={!originalImage}
                    />
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={applySaturationFilter}
                      disabled={!originalImage}
                      sx={{ mt: 1 }}
                    >
                      Aplicar Saturação
                    </Button>
                  </FormControl>
                </Grid>
              </Grid>
            </ControlPanel>
          </Grid>

          {/* Botões de filtros rápidos */}
          <Grid item xs={12}>
            <ButtonGroup 
              variant="contained" 
              color="primary" 
              aria-label="filter buttons"
              sx={{ mb: 3 }}
            >
              <Button onClick={applyInvertFilter} disabled={!originalImage}>
                Inverter Cores
              </Button>
              <Button onClick={applySepiaFilter} disabled={!originalImage}>
                Aplicar Sépia
              </Button>
              <Button onClick={resetImage} disabled={!originalImage}>
                Resetar
              </Button>
            </ButtonGroup>
          </Grid>
          
          {/* Imagens */}
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Imagem Original
              </Typography>
              {originalImage ? (
                <ImageDisplay 
                  image={originalImage} 
                  alt="Imagem Original" 
                />
              ) : (
                <ImageUploader onImageUpload={handleImageUpload} />
              )}
            </StyledPaper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Imagem Processada
              </Typography>
              {processedImage ? (
                <ImageDisplay 
                  image={processedImage} 
                  alt="Imagem Processada" 
                />
              ) : (
                <Box sx={{ 
                  height: 300, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'text.secondary' 
                }}>
                  {originalImage ? 
                    "Ajuste os controles e aplique os filtros" : 
                    "Carregue uma imagem primeiro"}
                </Box>
              )}
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}

export default ImageEnhancer;

