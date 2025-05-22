import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActionArea
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import BorderAllIcon from '@mui/icons-material/BorderAll';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import CalculateIcon from '@mui/icons-material/Calculate';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import FlipIcon from '@mui/icons-material/Flip';
import TuneIcon from '@mui/icons-material/Tune';
import EqualizerIcon from '@mui/icons-material/Equalizer';

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
  },
}));

const IconWrapper = styled(Box)(({ theme, color }) => ({
  backgroundColor: color || theme.palette.primary.main,
  color: 'white',
  borderRadius: '50%',
  padding: theme.spacing(2),
  display: 'inline-flex',
  marginBottom: theme.spacing(2),
}));

const features = [
  {
    title: 'Detector de Bordas',
    description: 'Aplique diferentes operadores para detectar bordas em imagens.',
    icon: <BorderAllIcon fontSize="large" />,
    path: '/border-detector',
    color: '#3f51b5'
  },
  {
    title: 'Filtro Gaussiano',
    description: 'Suavize imagens com filtro gaussiano personalizado.',
    icon: <BlurOnIcon fontSize="large" />,
    path: '/gaussian-filter',
    color: '#00897b'
  },
  {
    title: 'Limpeza de Imagem',
    description: 'Remova ruídos e artefatos indesejados de imagens.',
    icon: <CleaningServicesIcon fontSize="large" />,
    path: '/image-cleaner',
    color: '#5c6bc0'
  },
  {
    title: 'Realce de Imagem',
    description: 'Melhore a qualidade visual com técnicas de realce.',
    icon: <TuneIcon fontSize="large" />,
    path: '/image-highlight',
    color: '#7986cb'
  },
  {
    title: 'Conversor de Cores',
    description: 'Converta entre diferentes modelos de cores: RGB, HSV, CMYK.',
    icon: <ColorLensIcon fontSize="large" />,
    path: '/color-converter',
    color: '#e91e63'
  },
  {
    title: 'Calculadora de Imagem',
    description: 'Realize operações aritméticas e lógicas em imagens.',
    icon: <CalculateIcon fontSize="large" />,
    path: '/image-calculator',
    color: '#f44336'
  },
  {
    title: 'Inversor de Imagem',
    description: 'Inverta imagens horizontal e verticalmente.',
    icon: <FlipIcon fontSize="large" />,
    path: '/image-flipper',
    color: '#ff9800'
  },
  {
    title: 'Normalização de Histograma',
    description: 'Equalize histogramas para melhorar o contraste de imagens.',
    icon: <EqualizerIcon fontSize="large" />,
    path: '/image-normalize',
    color: '#8bc34a'
  }
];

function Home() {
  return (
    <Layout title="Processamento de Imagens">
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              Ferramenta de Processamento de Imagens
            </Typography>

          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Link to={feature.path} style={{ textDecoration: 'none' }}>
                  <FeatureCard>
                    <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                      <IconWrapper color={feature.color}>
                        {feature.icon}
                      </IconWrapper>
                      <Typography gutterBottom variant="h5" component="h2">
                        {feature.title}
                      </Typography>
                      <Typography color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </FeatureCard>
                </Link>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              Sobre o Projeto
            </Typography>
            <Typography variant="body1" paragraph sx={{ maxWidth: 800, mx: 'auto' }}>
              Esta aplicação foi desenvolvida como uma ferramenta educacional para demonstrar 
              diversos conceitos e técnicas de processamento digital de imagens. Cada módulo 
              implementa algoritmos específicos que permitem visualizar os efeitos de diferentes 
              transformações e filtros em imagens digitais.
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 800, mx: 'auto' }}>
              Explore as diferentes ferramentas disponíveis para aprender sobre detecção de bordas, 
              filtragem, equalização de histograma, conversão entre espaços de cores e muito mais. 
              Todas as operações são realizadas diretamente no navegador, sem necessidade de envio 
              de dados para servidores externos.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
}

export default Home;