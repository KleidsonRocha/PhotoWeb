import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import Modal from './Modal';

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  maxWidth: '100%',
  maxHeight: 300,
  overflow: 'hidden',
  borderRadius: theme.spacing(1),
  '&:hover .image-controls': {
    opacity: 1,
  },
}));

const Controls = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  right: 0,
  padding: theme.spacing(1),
  display: 'flex',
  gap: theme.spacing(1),
  backgroundColor: 'rgba(0,0,0,0.5)',
  borderTopLeftRadius: theme.spacing(1),
  opacity: 0,
  transition: 'opacity 0.3s ease',
}));

const StyledImage = styled('img')({
  maxWidth: '100%',
  maxHeight: 300,
  display: 'block',
  objectFit: 'contain',
});

function ImageDisplay({ image, alt }) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleSave = (e) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = typeof image === 'string' ? image : image.src;
    link.download = `processed-image-${Date.now()}.png`;
    link.click();
  };

  const handleZoom = (e) => {
    e.stopPropagation();
    setModalOpen(true);
  };

  return (
    <>
      <ImageContainer>
        <StyledImage 
          src={typeof image === 'string' ? image : image.src} 
          alt={alt} 
        />
        <Controls className="image-controls">
          <IconButton 
            size="small" 
            onClick={handleZoom}
            sx={{ color: 'white' }}
          >
            <ZoomInIcon />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={handleSave}
            sx={{ color: 'white' }}
          >
            <SaveAltIcon />
          </IconButton>
        </Controls>
      </ImageContainer>
      
      <Modal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)}
        title={alt}
      >
        <img 
          src={typeof image === 'string' ? image : image.src} 
          alt={alt} 
          style={{ maxWidth: '100%', maxHeight: '80vh' }} 
        />
      </Modal>
    </>
  );
}

export default ImageDisplay;