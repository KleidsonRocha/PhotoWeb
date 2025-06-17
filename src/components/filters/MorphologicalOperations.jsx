import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button,
  ButtonGroup,
  Slider,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import BlurOffIcon from '@mui/icons-material/BlurOff';
import FilterIcon from '@mui/icons-material/Filter';
import Layout from '../common/Layout';
import ImageUploader from '../common/ImageUploader';
import ImageDisplay from '../common/ImageDisplay';
import { applyDilate, applyErode, applyOpening, applyClosing } from '../../utils/imageProcessing';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const OperationInfoBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
}));

function MorphologicalOperations() {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [currentOperation, setCurrentOperation] = useState(null);
  const [kernelSize, setKernelSize] = useState(3);
  const [iterations, setIterations] = useState(1);

  const handleImageUpload = (imageFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setProcessedImage(null);
        setCurrentOperation(null);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
  };

  const applyOperation = (operation) => {
    if (!originalImage) return;

    setCurrentOperation(operation);
    
    let result;
    switch (operation) {
      case 'dilate':
        result = applyDilate(originalImage, kernelSize, iterations);
        break;
      case 'erode':
        result = applyErode(originalImage, kernelSize, iterations);
        break;
      case 'opening':
        result = applyOpening(originalImage, kernelSize, iterations);
        break;
      case 'closing':
        result = applyClosing(originalImage, kernelSize, iterations);
        break;
      default:
        return;
    }
    
    setProcessedImage(result.processedImageData);
  };

  const handleKernelSizeChange = (event, newValue) => {
    // Garantir que o valor seja ímpar
    const newSize = newValue % 2 === 0 ? newValue + 1 : newValue;
    setKernelSize(newSize);
    
    // Reaplica a operação atual se existir
    if (currentOperation) {
      applyOperation(currentOperation);
    }
  };

  const handleIterationsChange = (event, newValue) => {
    setIterations(newValue);
    
    // Reaplica a operação atual se existir
    if (currentOperation) {
      applyOperation(currentOperation);
    }
  };

  const getOperationDescription = () => {
    switch (currentOperation) {
      case 'dilate':
        return "A dilatação expande os objetos na imagem, preenchendo pequenos buracos e conectando áreas próximas. É útil para unir regiões quebradas e aumentar o tamanho de objetos.";
      case 'erode':
        return "A erosão encolhe os objetos na imagem, removendo pequenos detalhes e separando áreas conectadas por pontos finos. É útil para simplificar a estrutura e remover ruídos.";
      case 'opening':
        return "A abertura é uma erosão seguida de uma dilatação. Remove pequenos objetos e detalhes finos, mantendo o tamanho e a forma dos objetos maiores. É útil para remover ruídos.";
      case 'closing':
        return "O fechamento é uma dilatação seguida de uma erosão. Preenche pequenos buracos e conecta objetos próximos, mantendo o tamanho e a forma originais. É útil para fechar pequenas quebras e buracos.";
      default:
        return "Selecione uma operação morfológica para aplicar à imagem.";
    }
  };

  const getOperationName = () => {
    switch (currentOperation) {
      case 'dilate':
        return "Dilatação";
      case 'erode':
        return "Erosão";
      case 'opening':
        return "Abertura";
      case 'closing':
        return "Fechamento";
      default:
        return "";
    }
  };

  const getOperationIcon = () => {
    switch (currentOperation) {
      case 'dilate':
        return <BlurOnIcon />;
      case 'erode':
        return <BlurOffIcon />;
      case 'opening':
      case 'closing':
        return <FilterIcon />;
      default:
        return null;
    }
  };

  return (
    <Layout title="Operações Morfológicas">
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
                    Imagem Processada {currentOperation && `(${getOperationName()})`}
                  </Typography>
                  
                  {processedImage ? (
                    <ImageDisplay image={processedImage} alt="Imagem Processada" />
                  ) : (
                    <Box sx={{ 
                      height: 300, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'text.secondary' 
                    }}>
                      {originalImage ? 
                        "Selecione uma operação para aplicar" : 
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
                Operações Morfológicas
              </Typography>
              
              <ButtonGroup 
                orientation="vertical" 
                variant="contained" 
                fullWidth 
                sx={{ mb: 3 }}
              >
                <Button 
                  onClick={() => applyOperation('dilate')}
                  disabled={!originalImage}
                  color={currentOperation === 'dilate' ? 'primary' : 'inherit'}
                  startIcon={<BlurOnIcon />}
                >
                  Dilatação
                </Button>
                <Button 
                  onClick={() => applyOperation('erode')}
                  disabled={!originalImage}
                  color={currentOperation === 'erode' ? 'primary' : 'inherit'}
                  startIcon={<BlurOffIcon />}
                >
                  Erosão
                </Button>
                <Button 
                  onClick={() => applyOperation('opening')}
                  disabled={!originalImage}
                  color={currentOperation === 'opening' ? 'primary' : 'inherit'}
                  startIcon={<FilterIcon />}
                >
                  Abertura
                </Button>
                <Button 
                  onClick={() => applyOperation('closing')}
                  disabled={!originalImage}
                  color={currentOperation === 'closing' ? 'primary' : 'inherit'}
                  startIcon={<FilterIcon />}
                >
                  Fechamento
                </Button>
              </ButtonGroup>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Parâmetros
              </Typography>
              
              <Box sx={{ px: 1, mb: 3 }}>
                <Typography id="kernel-size-slider" gutterBottom>
                  Tamanho do Elemento Estruturante: {kernelSize}x{kernelSize}
                </Typography>
                <Slider
                  aria-labelledby="kernel-size-slider"
                  value={kernelSize}
                  onChange={handleKernelSizeChange}
                  step={2}
                  marks
                  min={3}
                  max={11}
                  disabled={!originalImage}
                  valueLabelDisplay="auto"
                />
                
                <Typography id="iterations-slider" gutterBottom sx={{ mt: 2 }}>
                  Número de Iterações: {iterations}
                </Typography>
                <Slider
                  aria-labelledby="iterations-slider"
                  value={iterations}
                  onChange={handleIterationsChange}
                  step={1}
                  marks
                  min={1}
                  max={5}
                  disabled={!originalImage}
                  valueLabelDisplay="auto"
                />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                {getOperationIcon()} 
                <Box component="span" sx={{ ml: 1 }}>
                  {currentOperation ? getOperationName() : "Descrição"}
                </Box>
              </Typography>
              
              <OperationInfoBox>
                <Typography variant="body2">
                  {getOperationDescription()}
                </Typography>
              </OperationInfoBox>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  As operações morfológicas são técnicas de processamento de imagens baseadas na teoria dos conjuntos.
                  Elas são particularmente úteis para análise de formas, extração de características e pré-processamento
                  para reconhecimento de padrões.
                </Typography>
              </Box>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}

export default MorphologicalOperations;