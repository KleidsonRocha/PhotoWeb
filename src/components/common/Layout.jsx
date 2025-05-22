// src/components/common/Layout.jsx
import React, { useContext } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  IconButton,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { NavbarContext } from '../../contexts/NavbarContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import Navbar from './Navbar';

const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'isExpanded',
})(({ theme, isExpanded }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: isExpanded ? 280 : 0, // Ajustado para a nova largura da barra lateral
}));

const Header = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

function Layout({ children, title }) {
  const { isExpanded, toggleNavbar } = useContext(NavbarContext);
  const { mode, toggleColorMode } = useContext(ThemeContext);

  return (
    <Box sx={{ display: 'flex' }}>
      <Header position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleNavbar}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {title || 'Processamento de Imagens'}
          </Typography>
          
          <Tooltip title={mode === 'dark' ? "Mudar para modo claro" : "Mudar para modo escuro"}>
            <IconButton color="inherit" onClick={toggleColorMode}>
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </Header>
      <Navbar />
      <Main isExpanded={isExpanded}>
        <Toolbar /> {/* Espaço para a barra de ferramentas */}
        <Container maxWidth="xl" sx={{ mt: 4 }}>
          {children}
        </Container>
      </Main>
    </Box>
  );
}

export default Layout;