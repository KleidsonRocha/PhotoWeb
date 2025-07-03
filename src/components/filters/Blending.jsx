import React, { useState } from 'react';
import { Box, Container, Grid, Typography, Button, ButtonGroup, Paper, Slider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import Layout from '../common/Layout';
import ImageUploader from '../common/ImageUploader';
import ImageDisplay from '../common/ImageDisplay';
import { blendImages } from '../../utils/imageProcessing';

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

const blendingModes = [
  { value: 'normal', label: 'Normal' },
  { value: 'add', label: 'Adição' },
  { value: 'subtract', label: 'Subtração' },
  { value: 'multiply', label: 'Multiplicação' },
  { value: 'screen', label: 'Screen' },
  { value: 'overlay', label: 'Overlay' },
  { value: 'difference', label: 'Diferença' },
  { value: 'lighten', label: 'Clarear' },
  { value: 'darken', label: 'Escurecer' },
  { value: 'exclusion', label: 'Exclusão' },
  { value: 'color-dodge', label: 'Color Dodge' },
  { value: 'color-burn', label: 'Color Burn' },
  { value: 'hard-light', label: 'Luz Dura' },
  { value: 'soft-light', label: 'Luz Suave' },
  { value: 'average', label: 'Média' },
  { value: 'negation', label: 'Negação' }
];

function Blending() {
  const [firstImage, setFirstImage] = useState(null);
  const [secondImage, setSecondImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [blendMode, setBlendMode] = useState('normal');
  const [opacity, setOpacity] = useState(1.0);
  const [blendInfo, setBlendInfo] = useState(null);

  const handleFirstImageUpload = (imageFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setFirstImage(img);
        setProcessedImage(null);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
  };

  const handleSecondImageUpload = (imageFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setSecondImage(img);
        setProcessedImage(null);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
  };

  const handleBlendModeChange = (event) => {
    setBlendMode(event.target.value);
    if (firstImage && secondImage) {
      applyBlending(event.target.value, opacity);
    }
  };

  const handleOpacityChange = (event, newValue) => {
    setOpacity(newValue);
    if (firstImage && secondImage) {
      applyBlending(blendMode, newValue);
    }
  };

  const applyBlending = (mode, opacityValue) => {
    if (!firstImage || !secondImage) return;
    
    const result = blendImages(firstImage, secondImage, mode, opacityValue);
    setProcessedImage(result.processedImageData);
    setBlendInfo({
      mode: result.blendMode,
      opacity: result.opacity
    });
  };

  const resetImages = () => {
    setFirstImage(null);
    setSecondImage(null);
    setProcessedImage(null);
    setBlendInfo(null);
  };

  return (
    <Layout title="Mesclagem de Imagens">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
              <FormControl fullWidth variant="outlined" sx={{ minWidth: 200 }}>
                <InputLabel id="blend-mode-label">Modo de Mesclagem</InputLabel>
                <Select
                  labelId="blend-mode-label"
                  id="blend-mode-select"
                  value={blendMode}
                  onChange={handleBlendModeChange}
                  label="Modo de Mesclagem"
                  disabled={!firstImage || !secondImage}
                >
                  {blendingModes.map((mode) => (
                    <MenuItem key={mode.value} value={mode.value}>
                      {mode.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Box sx={{ width: '100%', maxWidth: 300 }}>
                <Typography id="opacity-slider" gutterBottom>
                  Opacidade: {opacity.toFixed(2)}
                </Typography>
                <Slider
                  aria-labelledby="opacity-slider"
                  value={opacity}
                  onChange={handleOpacityChange}
                  min={0}
                  max={1}
                  step={0.01}
                  disabled={!firstImage || !secondImage}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => value.toFixed(2)}
                />
              </Box>
              
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={resetImages}
                sx={{ height: { sm: 56 } }}
              >
                Reiniciar
              </Button>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Primeira Imagem (Base)
              </Typography>
              {firstImage ? (
                <ImageDisplay 
                  image={firstImage.src} 
                  alt="Primeira Imagem" 
                />
              ) : (
                <ImageUploader onImageUpload={handleFirstImageUpload} />
              )}
            </StyledPaper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Segunda Imagem (Sobreposição)
              </Typography>
              {secondImage ? (
                <ImageDisplay 
                  image={secondImage.src} 
                  alt="Segunda Imagem" 
                />
              ) : (
                <ImageUploader onImageUpload={handleSecondImageUpload} />
              )}
            </StyledPaper>
          </Grid>
          
          <Grid item xs={12}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Resultado da Mesclagem
              </Typography>
              {processedImage ? (
                <>
                  <ImageDisplay 
                    image={processedImage} 
                    alt="Imagem Mesclada" 
                  />
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Modo: {blendingModes.find(mode => mode.value === blendInfo.mode)?.label || blendInfo.mode}
                      {' | '}
                      Opacidade: {blendInfo.opacity.toFixed(2)}
                    </Typography>
                  </Box>
                </>
              ) : (
                <Box sx={{ 
                  height: 300, 
                  width: '100%',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'text.secondary' 
                }}>
                  {firstImage && secondImage ? 
                    "Selecione um modo de mesclagem para aplicar" : 
                    "Carregue as duas imagens primeiro"}
                </Box>
              )}
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}

export default Blending;