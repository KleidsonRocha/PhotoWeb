import React, { useState } from 'react';
import { Box, Container, Grid, Typography, Button, ButtonGroup, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import Layout from '../common/Layout';
import ImageUploader from '../common/ImageUploader';
import ImageDisplay from '../common/ImageDisplay';
import { applySobel, applyPrewitt, applyLaplacian } from '../../utils/imageProcessing';
import KernelDisplay from '../common/KernelDisplay';

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

function BorderDetector() {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [currentKernel, setCurrentKernel] = useState(null);

  const handleImageUpload = (imageFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setProcessedImage(null);
        setCurrentKernel(null);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
  };

  const handleSobel = () => {
    if (!originalImage) return;
    const { processedImageData, kernel } = applySobel(originalImage);
    setProcessedImage(processedImageData);
    setCurrentKernel(kernel);
  };

  const handlePrewitt = () => {
    if (!originalImage) return;
    const { processedImageData, kernel } = applyPrewitt(originalImage);
    setProcessedImage(processedImageData);
    setCurrentKernel(kernel);
  };

  const handleLaplacian = () => {
    if (!originalImage) return;
    const { processedImageData, kernel } = applyLaplacian(originalImage);
    setProcessedImage(processedImageData);
    setCurrentKernel(kernel);
  };

  return (
    <Layout title="Detector de Bordas">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <ButtonGroup 
              variant="contained" 
              color="primary" 
              aria-label="filter buttons"
              sx={{ mb: 3 }}
            >
              <Button onClick={handleSobel} disabled={!originalImage}>
                Aplicar Sobel
              </Button>
              <Button onClick={handlePrewitt} disabled={!originalImage}>
                Aplicar Prewitt
              </Button>
              <Button onClick={handleLaplacian} disabled={!originalImage}>
                Aplicar Laplaciano
              </Button>
            </ButtonGroup>
          </Grid>
          
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
          
          {currentKernel && (
            <Grid item xs={12}>
              <KernelDisplay kernel={currentKernel} />
            </Grid>
          )}
        </Grid>
      </Container>
    </Layout>
  );
}

export default BorderDetector;