import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import Layout from '../common/Layout';
import ImageUploader from '../common/ImageUploader';
import ImageDisplay from '../common/ImageDisplay';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);


const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const HistogramContainer = styled(Box)(({ theme }) => ({
  height: 250,
  position: 'relative',
  marginTop: theme.spacing(2),
}));

function ImageNormalize() {
  const [originalImage, setOriginalImage] = useState(null);
  const [equalizedImage, setEqualizedImage] = useState(null);
  const [originalHistogram, setOriginalHistogram] = useState(null);
  const [equalizedHistogram, setEqualizedHistogram] = useState(null);
  
  const originalHistogramRef = useRef(null);
  const equalizedHistogramRef = useRef(null);
  const originalCanvasRef = useRef(null);
  const equalizedCanvasRef = useRef(null);

  useEffect(() => {
    return () => {
      // Limpar gráficos ao desmontar
      if (originalHistogramRef.current) {
        originalHistogramRef.current.destroy();
      }
      if (equalizedHistogramRef.current) {
        equalizedHistogramRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (originalHistogram && originalCanvasRef.current) {
      renderHistogram(originalCanvasRef.current, originalHistogram, 'Histograma Original', originalHistogramRef);
    }
  }, [originalHistogram]);

  useEffect(() => {
    if (equalizedHistogram && equalizedCanvasRef.current) {
      renderHistogram(equalizedCanvasRef.current, equalizedHistogram, 'Histograma Equalizado', equalizedHistogramRef);
    }
  }, [equalizedHistogram]);

  const renderHistogram = (canvas, histogram, title, chartRef) => {
    // Destruir gráfico existente se houver
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvas.getContext('2d');
    
    const chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: 256 }, (_, i) => i),
        datasets: [
          {
            label: 'Canal R',
            data: histogram.r,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            tension: 0.1
          },
          {
            label: 'Canal G',
            data: histogram.g,
            backgroundColor: 'rgba(75, 192, 75, 0.5)',
            borderColor: 'rgba(75, 192, 75, 1)',
            borderWidth: 1,
            tension: 0.1
          },
          {
            label: 'Canal B',
            data: histogram.b,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Frequência'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Valor de Pixel (0-255)'
            },
            ticks: {
              maxTicksLimit: 25
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: title,
            color: '#333',
            font: {
              size: 16
            }
          },
          legend: {
            labels: {
              color: '#333'
            }
          }
        }
      }
    });

    chartRef.current = chartInstance;
  };

  const handleImageUpload = (imageFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);

        // Calcular histograma original
        const { histData } = calculateHistogram(img);
        setOriginalHistogram(histData);

        // Equalizar imagem e calcular novo histograma
        const { equalizedImgUrl, equalizedHistData } = equalizeHistogram(img);
        setEqualizedImage(equalizedImgUrl);
        setEqualizedHistogram(equalizedHistData);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
  };

  const calculateHistogram = (img) => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, img.width, img.height);
    const data = imgData.data;

    // Inicializa histogramas para cada canal
    const histData = {
      r: new Array(256).fill(0),
      g: new Array(256).fill(0),
      b: new Array(256).fill(0)
    };

    // Calcula histograma para cada canal
    for (let i = 0; i < data.length; i += 4) {
      histData.r[data[i]]++;        // Canal vermelho
      histData.g[data[i + 1]]++;    // Canal verde
      histData.b[data[i + 2]]++;    // Canal azul
    }

    return { histData };
  };

  const equalizeHistogram = (img) => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, img.width, img.height);
    const data = imgData.data;
    const totalPixels = img.width * img.height;

    // Inicializa histogramas e CDFs para cada canal
    const histograms = {
      r: new Array(256).fill(0),
      g: new Array(256).fill(0),
      b: new Array(256).fill(0)
    };

    // Calcula histogramas
    for (let i = 0; i < data.length; i += 4) {
      histograms.r[data[i]]++;
      histograms.g[data[i + 1]]++;
      histograms.b[data[i + 2]]++;
    }

    // Calcula CDFs para cada canal
    const cdfs = {
      r: new Array(256),
      g: new Array(256),
      b: new Array(256)
    };

    // CDF para canal R
    cdfs.r[0] = histograms.r[0];
    for (let i = 1; i < 256; i++) {
      cdfs.r[i] = cdfs.r[i - 1] + histograms.r[i];
    }

    // CDF para canal G
    cdfs.g[0] = histograms.g[0];
    for (let i = 1; i < 256; i++) {
      cdfs.g[i] = cdfs.g[i - 1] + histograms.g[i];
    }

    // CDF para canal B
    cdfs.b[0] = histograms.b[0];
    for (let i = 1; i < 256; i++) {
      cdfs.b[i] = cdfs.b[i - 1] + histograms.b[i];
    }

    // Encontra os valores mínimos não-zero para cada CDF
    const cdfMinR = cdfs.r.find(v => v > 0) || 0;
    const cdfMinG = cdfs.g.find(v => v > 0) || 0;
    const cdfMinB = cdfs.b.find(v => v > 0) || 0;

    // Inicializa histogramas para a imagem equalizada
    const equalizedHistData = {
      r: new Array(256).fill(0),
      g: new Array(256).fill(0),
      b: new Array(256).fill(0)
    };

    // Aplica a equalização em cada canal
    for (let i = 0; i < data.length; i += 4) {
      // Canal R
      const rOld = data[i];
      const rNew = Math.floor(((cdfs.r[rOld] - cdfMinR) / (totalPixels - cdfMinR)) * 255);
      data[i] = rNew;
      equalizedHistData.r[rNew]++;

      // Canal G
      const gOld = data[i + 1];
      const gNew = Math.floor(((cdfs.g[gOld] - cdfMinG) / (totalPixels - cdfMinG)) * 255);
      data[i + 1] = gNew;
      equalizedHistData.g[gNew]++;

      // Canal B
      const bOld = data[i + 2];
      const bNew = Math.floor(((cdfs.b[bOld] - cdfMinB) / (totalPixels - cdfMinB)) * 255);
      data[i + 2] = bNew;
      equalizedHistData.b[bNew]++;
    }

    // Atualiza a imagem com os dados equalizados
    ctx.putImageData(imgData, 0, 0);
    const equalizedImgUrl = canvas.toDataURL();

    return { equalizedImgUrl, equalizedHistData };
  };

  const handleSaveImage = (imageType) => {
    let imageUrl;
    if (imageType === 'original') {
      imageUrl = originalImage.src;
    } else {
      imageUrl = equalizedImage;
    }

    if (!imageUrl) return;

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `image_${imageType}_${Date.now()}.png`;
    link.click();
  };

  return (
    <Layout title="Equalização de Histograma">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Imagem Original
              </Typography>
              
              {originalImage ? (
                <>
                  <ImageDisplay image={originalImage} alt="Imagem Original" />
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      startIcon={<SaveIcon />} 
                      variant="outlined" 
                      onClick={() => handleSaveImage('original')}
                    >
                      Salvar Imagem Original
                    </Button>
                  </Box>
                </>
              ) : (
                <ImageUploader onImageUpload={handleImageUpload} />
              )}
              
              {originalHistogram && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <EqualizerIcon sx={{ mr: 1 }} /> Histograma Original
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <HistogramContainer>
                    <canvas ref={originalCanvasRef} />
                  </HistogramContainer>
                </Box>
              )}
            </StyledPaper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Imagem Equalizada
              </Typography>
              
              {equalizedImage ? (
                <>
                  <ImageDisplay image={equalizedImage} alt="Imagem Equalizada" />
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      startIcon={<SaveIcon />} 
                      variant="outlined" 
                      onClick={() => handleSaveImage('equalized')}
                    >
                      Salvar Imagem Equalizada
                    </Button>
                  </Box>
                </>
              ) : (
                <Box sx={{ 
                  height: 300, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'text.secondary' 
                }}>
                  {originalImage ? 
                    "Processando..." : 
                    "Carregue uma imagem primeiro"}
                </Box>
              )}
              
              {equalizedHistogram && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <EqualizerIcon sx={{ mr: 1 }} /> Histograma Equalizado
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <HistogramContainer>
                    <canvas ref={equalizedCanvasRef} />
                  </HistogramContainer>
                </Box>
              )}
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}

export default ImageNormalize;