import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Button, 
  ButtonGroup, 
  Paper,
  TextField,
  FormControl,
  FormLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Layout from '../common/Layout';
import ImageUploader from '../common/ImageUploader';
import ImageDisplay from '../common/ImageDisplay';
import { 
  rotateImage,
  flipHorizontal,
  flipVertical,
  resizeImage
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

function ImageTransformer() {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [rotationAngle, setRotationAngle] = useState(90);
  const [newWidth, setNewWidth] = useState(400);
  const [newHeight, setNewHeight] = useState(300);

  const handleImageUpload = (imageFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setProcessedImage(null);
        // Definir dimensões padrão baseadas na imagem original
        setNewWidth(img.width);
        setNewHeight(img.height);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
  };

  const handleRotate = () => {
    if (!originalImage) return;
    const result = rotateImage(originalImage, rotationAngle);
    setProcessedImage(result);
  };

  const handleFlipHorizontal = () => {
    if (!originalImage) return;
    const result = flipHorizontal(originalImage);
    setProcessedImage(result);
  };

  const handleFlipVertical = () => {
    if (!originalImage) return;
    const result = flipVertical(originalImage);
    setProcessedImage(result);
  };

  const handleResize = () => {
    if (!originalImage) return;
    const result = resizeImage(originalImage, newWidth, newHeight);
    setProcessedImage(result);
  };

  const resetImage = () => {
    setProcessedImage(null);
  };

  const handleQuickRotate = (angle) => {
    if (!originalImage) return;
    const result = rotateImage(originalImage, angle);
    setProcessedImage(result);
  };

  return (
    <Layout title="Transformações de Imagem">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Controles de transformação */}
          <Grid item xs={12}>
            <ControlPanel>
              <Typography variant="h6" gutterBottom>
                Controles de Transformação
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <FormLabel>Rotação Personalizada</FormLabel>
                    <TextField
                      type="number"
                      value={rotationAngle}
                      onChange={(e) => setRotationAngle(Number(e.target.value))}
                      label="Ângulo (graus)"
                      disabled={!originalImage}
                      sx={{ mb: 1 }}
                    />
                    <Button 
                      variant="outlined" 
                      onClick={handleRotate}
                      disabled={!originalImage}
                    >
                      Rotacionar
                    </Button>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <FormLabel>Redimensionar</FormLabel>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <TextField
                        type="number"
                        value={newWidth}
                        onChange={(e) => setNewWidth(Number(e.target.value))}
                        label="Largura"
                        disabled={!originalImage}
                        size="small"
                      />
                      <TextField
                        type="number"
                        value={newHeight}
                        onChange={(e) => setNewHeight(Number(e.target.value))}
                        label="Altura"
                        disabled={!originalImage}
                        size="small"
                      />
                    </Box>
                    <Button 
                      variant="outlined" 
                      onClick={handleResize}
                      disabled={!originalImage}
                    >
                      Redimensionar
                    </Button>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <FormLabel>Informações da Imagem</FormLabel>
                    {originalImage && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2">
                          Dimensões originais: {originalImage.width} x {originalImage.height}
                        </Typography>
                        <Typography variant="body2">
                          Proporção: {(originalImage.width / originalImage.height).toFixed(2)}
                        </Typography>
                      </Box>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </ControlPanel>
          </Grid>

          {/* Botões de transformações rápidas */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Transformações Rápidas
            </Typography>
            <ButtonGroup 
              variant="contained" 
              color="primary" 
              aria-label="transform buttons"
              sx={{ mb: 2, mr: 2 }}
            >
              <Button onClick={() => handleQuickRotate(90)} disabled={!originalImage}>
                Rotacionar 90°
              </Button>
              <Button onClick={() => handleQuickRotate(180)} disabled={!originalImage}>
                Rotacionar 180°
              </Button>
              <Button onClick={() => handleQuickRotate(270)} disabled={!originalImage}>
                Rotacionar 270°
              </Button>
            </ButtonGroup>
            
            <ButtonGroup 
              variant="contained" 
              color="secondary" 
              aria-label="flip buttons"
              sx={{ mb: 2 }}
            >
              <Button onClick={handleFlipHorizontal} disabled={!originalImage}>
                Espelhar Horizontal
              </Button>
              <Button onClick={handleFlipVertical} disabled={!originalImage}>
                Espelhar Vertical
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
                Imagem Transformada
              </Typography>
              {processedImage ? (
                <ImageDisplay 
                  image={processedImage} 
                  alt="Imagem Transformada" 
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
                    "Selecione uma transformação para aplicar" : 
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

export default ImageTransformer;

