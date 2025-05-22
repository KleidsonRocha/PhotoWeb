import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton, 
  Box,
  Zoom
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(2),
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    maxWidth: '90vw',
    maxHeight: '90vh',
  },
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  top: theme.spacing(1),
  color: theme.palette.grey[500],
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

function Modal({ open, onClose, title, children }) {
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      TransitionComponent={Transition}
    >
      {title && (
        <DialogTitle>
          {title}
          <CloseButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </CloseButton>
        </DialogTitle>
      )}
      <DialogContent>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          p: 2
        }}>
          {children}
        </Box>
      </DialogContent>
    </StyledDialog>
  );
}

export default Modal;