import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Slider, 
  TextField, 
  InputAdornment 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Layout from '../common/Layout';
import { rgbToHsv, hsvToRgb, rgbToCmyk, cmykToRgb } from '../../utils/colorConversion';

const ColorPreview = styled(Box)(({ bgcolor }) => ({
  width: '100%',
  height: 200,
  backgroundColor: bgcolor,
  borderRadius: 8,
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  marginBottom: 24,
  cursor: 'pointer',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const ColorSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

function ColorConverter() {
  const [rgb, setRgb] = useState({ r: 0, g: 0, b: 0 });
  const [hsv, setHsv] = useState({ h: 0, s: 0, v: 0 });
  const [cmyk, setCmyk] = useState({ c: 0, m: 0, y: 0, k: 0 });
  const [gray, setGray] = useState(0);

  const handleRgbChange = (channel, value) => {
    const normalizedValue = Math.min(255, Math.max(0, value));
    const updatedRgb = { ...rgb, [channel]: normalizedValue };
    setRgb(updatedRgb);
    
    // Atualizar outros modelos de cor
    const updatedHsv = rgbToHsv(updatedRgb.r, updatedRgb.g, updatedRgb.b);
    setHsv(updatedHsv);
    
    const updatedCmyk = rgbToCmyk(updatedRgb.r, updatedRgb.g, updatedRgb.b);
    setCmyk(updatedCmyk);
    
    setGray(calculateGray(updatedRgb.r, updatedRgb.g, updatedRgb.b));
  };

  const handleHsvChange = (channel, value) => {
    const maxValue = channel === 'h' ? 360 : 100;
    const normalizedValue = Math.min(maxValue, Math.max(0, value));
    const updatedHsv = { ...hsv, [channel]: normalizedValue };
    setHsv(updatedHsv);
    
    // Atualizar RGB e outros modelos
    const updatedRgb = hsvToRgb(updatedHsv.h, updatedHsv.s, updatedHsv.v);
    setRgb(updatedRgb);
    
    const updatedCmyk = rgbToCmyk(updatedRgb.r, updatedRgb.g, updatedRgb.b);
    setCmyk(updatedCmyk);
    
    setGray(calculateGray(updatedRgb.r, updatedRgb.g, updatedRgb.b));
  };

  const handleCmykChange = (channel, value) => {
    const normalizedValue = Math.min(100, Math.max(0, value));
    const updatedCmyk = { ...cmyk, [channel]: normalizedValue };
    setCmyk(updatedCmyk);
    
    // Atualizar RGB e outros modelos
    const updatedRgb = cmykToRgb(updatedCmyk.c, updatedCmyk.m, updatedCmyk.y, updatedCmyk.k);
    setRgb(updatedRgb);
    
    const updatedHsv = rgbToHsv(updatedRgb.r, updatedRgb.g, updatedRgb.b);
    setHsv(updatedHsv);
    
    setGray(calculateGray(updatedRgb.r, updatedRgb.g, updatedRgb.b));
  };

  const calculateGray = (r, g, b) => {
    return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  };

  const handleColorPickerChange = (e) => {
    const hex = e.target.value;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    handleRgbChange('r', r);
    handleRgbChange('g', g);
    handleRgbChange('b', b);
  };

  const rgbColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

  return (
    <Layout title="Conversor de Cores">
      <Container maxWidth="md">
        <Box position="relative">
          <ColorPreview bgcolor={rgbColor}>
            <input 
              type="color" 
              value={`#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`}
              onChange={handleColorPickerChange}
              style={{ opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
            />
          </ColorPreview>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ColorSection>
              <Typography variant="h6" gutterBottom>RGB</Typography>
              
              {['r', 'g', 'b'].map((channel, index) => (
                <Box key={channel} sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                      <Typography color={['error', 'success', 'primary'][index]}>
                        {channel.toUpperCase()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Slider
                        value={rgb[channel]}
                        onChange={(_, value) => handleRgbChange(channel, value)}
                        min={0}
                        max={255}
                        valueLabelDisplay="auto"
                        color={['error', 'success', 'primary'][index]}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        value={rgb[channel]}
                        onChange={(e) => handleRgbChange(channel, parseInt(e.target.value) || 0)}
                        variant="outlined"
                        size="small"
                        type="number"
                        inputProps={{ min: 0, max: 255 }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </ColorSection>
          </Grid>

          <Grid item xs={12} md={6}>
            <ColorSection>
              <Typography variant="h6" gutterBottom>HSV</Typography>
              
              {[
                { key: 'h', label: 'Matiz', max: 360, unit: '°' },
                { key: 's', label: 'Saturação', max: 100, unit: '%' },
                { key: 'v', label: 'Valor', max: 100, unit: '%' }
              ].map((item) => (
                <Box key={item.key} sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                      <Typography>{item.label}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Slider
                        value={hsv[item.key]}
                        onChange={(_, value) => handleHsvChange(item.key, value)}
                        min={0}
                        max={item.max}
                        valueLabelDisplay="auto"
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        value={hsv[item.key]}
                        onChange={(e) => handleHsvChange(item.key, parseInt(e.target.value) || 0)}
                        variant="outlined"
                        size="small"
                        type="number"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">{item.unit}</InputAdornment>,
                        }}
                        inputProps={{ min: 0, max: item.max }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </ColorSection>
          </Grid>

          <Grid item xs={12} md={6}>
            <ColorSection>
              <Typography variant="h6" gutterBottom>CMYK</Typography>
              
              {[
                { key: 'c', label: 'Ciano', color: 'cyan' },
                { key: 'm', label: 'Magenta', color: 'magenta' },
                { key: 'y', label: 'Amarelo', color: 'yellow' },
                { key: 'k', label: 'Preto', color: 'grey.800' }
              ].map((item) => (
                <Box key={item.key} sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                      <Typography color={item.color}>{item.label}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Slider
                        value={cmyk[item.key]}
                        onChange={(_, value) => handleCmykChange(item.key, value)}
                        min={0}
                        max={100}
                        valueLabelDisplay="auto"
                        sx={{ color: item.color }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        value={cmyk[item.key]}
                        onChange={(e) => handleCmykChange(item.key, parseInt(e.target.value) || 0)}
                        variant="outlined"
                        size="small"
                        type="number"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                        inputProps={{ min: 0, max: 100 }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </ColorSection>
          </Grid>

          <Grid item xs={12} md={6}>
            <ColorSection>
              <Typography variant="h6" gutterBottom>Escala de Cinza</Typography>
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <Typography>Valor</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Slider
                      value={gray}
                      min={0}
                      max={255}
                      valueLabelDisplay="auto"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      value={gray}
                      variant="outlined"
                      size="small"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ mt: 4, p: 2, bgcolor: `rgb(${gray}, ${gray}, ${gray})`, borderRadius: 1, height: 50 }} />
            </ColorSection>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}

export default ColorConverter;