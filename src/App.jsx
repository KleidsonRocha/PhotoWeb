import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { NavbarProvider } from './contexts/NavbarContext';
import { ThemeProvider } from './contexts/ThemeContext'; // Importe o ThemeProvider personalizado

// Componentes de páginas
import BorderDetector from './components/filters/BorderDetection';
import GaussianFilter from './components/filters/GaussianFilter';
import ImageCleaner from './components/filters/ImageCleaner';
import ImageHighlight from './components/filters/ImageHighlight';
import MorphologicalOperations from './components/filters/MorphologicalOperations';
import ColorConverter from './components/tools/ColorConverter';
import ImageCalculator from './components/tools/ImageCalculator';
import ImageFlipper from './components/tools/ImageFlipper';
import ImageNormalize from './components/tools/ImageNormalize';
import Home from './components/common/Home';

function App() {
  return (
    <ThemeProvider>
      <NavbarProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/border-detector" element={<BorderDetector />} />
            <Route path="/gaussian-filter" element={<GaussianFilter />} />
            <Route path="/image-cleaner" element={<ImageCleaner />} />
            <Route path="/image-highlight" element={<ImageHighlight />} />
            <Route path="/color-converter" element={<ColorConverter />} />
            <Route path="/image-calculator" element={<ImageCalculator />} />
            <Route path="/image-flipper" element={<ImageFlipper />} />
            <Route path="/image-normalize" element={<ImageNormalize />} />
            <Route path="/morphological-operations" element={<MorphologicalOperations />} />
          </Routes>
        </Router>
      </NavbarProvider>
    </ThemeProvider>
  );
}

export default App;