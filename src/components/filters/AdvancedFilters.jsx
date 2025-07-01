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
  applySimpleBlur,
  applySharpen,
  applyEmboss,
  applyEdgeDetection,
  applyThreshold,
  addNoise,
  applyMedianFilter,
  equalizeHistogram,
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

function AdvancedFilters() {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [blurRadius, setBlurRadius] = useState(1);
  const [thresholdValue, setThresholdValue] = useState(128);
  const [noiseIntensity, setNoiseIntensity] = useState(50);
  const [medianRadius, setMedianRadius] = useState(1);

  const handleImageUpload = (imageFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setProcessedImage(null);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
  };

  const applyBlurFilter = () => {
    if (!originalImage) return;
    const result = applyImageDataFilter(originalImage, applySimpleBlur, blurRadius);
    setProcessedImage(result);
  };

  const applySharpenFilter = () => {
    if (!originalImage) return;
    const result = applyImageDataFilter(originalImage, applySharpen);
    setProcessedImage(result);
  };

  const applyEmbossFilter = () => {
    if (!originalImage) return;
    const result = applyImageDataFilter(originalImage, applyEmboss);
    setProcessedImage(result);
  };

  const applyEdgeFilter = () => {
    if (!originalImage) return;
    const result = applyImageDataFilter(originalImage, applyEdgeDetection);
    setProcessedImage(result);
  };

  const applyThresholdFilter = () => {
    if (!originalImage) return;
    const result = applyImageDataFilter(originalImage, applyThreshold, thresholdValue);
    setProcessedImage(result);
  };

  const applyNoiseFilter = () => {
    if (!originalImage) return;
    const result = applyImageDataFilter(originalImage, addNoise, noiseIntensity);
    setProcessedImage(result);
  };

  const applyMedianFilterFunc = () => {
    if (!originalImage) return;
    const result = applyImageDataFilter(originalImage, applyMedianFilter, medianRadius);
    setProcessedImage(result);
  };

  const applyHistogramEqualization = () => {
    if (!originalImage) return;
    const result = applyImageDataFilter(originalImage, equalizeHistogram);
    setProcessedImage(result);
  };

  const resetImage = () => {
    setProcessedImage(null);
  };

  return (
    <Layout title="Filtros Avançados">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Controles parametrizados */}
          <Grid item xs={12}>
            <ControlPanel>
              <Typography variant="h6" gutterBottom>
                Controles de Filtros Parametrizados
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <FormLabel>Raio do Blur: {blurRadius}</FormLabel>
                    <Slider
                      value={blurRadius}
                      onChange={(e, value) => setBlurRadius(value)}
                      min={1}
                      max={10}
                      step={1}
                      disabled={!originalImage}
                    />
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={applyBlurFilter}
                      disabled={!originalImage}
                      sx={{ mt: 1 }}
                    >
                      Aplicar Blur
                    </Button>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <FormLabel>Threshold: {thresholdValue}</FormLabel>
                    <Slider
                      value={thresholdValue}
                      onChange={(e, value) => setThresholdValue(value)}
                      min={0}
                      max={255}
                      step={1}
                      disabled={!originalImage}
                    />
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={applyThresholdFilter}
                      disabled={!originalImage}
                      sx={{ mt: 1 }}
                    >
                      Aplicar Threshold
                    </Button>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <FormLabel>Intensidade do Ruído: {noiseIntensity}</FormLabel>
                    <Slider
                      value={noiseIntensity}
                      onChange={(e, value) => setNoiseIntensity(value)}
                      min={10}
                      max={100}
                      step={5}
                      disabled={!originalImage}
                    />
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={applyNoiseFilter}
                      disabled={!originalImage}
                      sx={{ mt: 1 }}
                    >
                      Adicionar Ruído
                    </Button>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <FormLabel>Raio Mediana: {medianRadius}</FormLabel>
                    <Slider
                      value={medianRadius}
                      onChange={(e, value) => setMedianRadius(value)}
                      min={1}
                      max={5}
                      step={1}
                      disabled={!originalImage}
                    />
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={applyMedianFilterFunc}
                      disabled={!originalImage}
                      sx={{ mt: 1 }}
                    >
                      Filtro Mediana
                    </Button>
                  </FormControl>
                </Grid>
              </Grid>
            </ControlPanel>
          </Grid>

          {/* Botões de filtros fixos */}
          <Grid item xs={12}>
            <ButtonGroup 
              variant="contained" 
              color="primary" 
              aria-label="filter buttons"
              sx={{ mb: 3, flexWrap: 'wrap' }}
            >
              <Button onClick={applySharpenFilter} disabled={!originalImage}>
                Nitidez
              </Button>
              <Button onClick={applyEmbossFilter} disabled={!originalImage}>
                Relevo
              </Button>
              <Button onClick={applyEdgeFilter} disabled={!originalImage}>
                Detecção de Bordas
              </Button>
              <Button onClick={applyHistogramEqualization} disabled={!originalImage}>
                Equalizar Histograma
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
                    "Selecione um filtro para aplicar" : 
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

export default AdvancedFilters;

