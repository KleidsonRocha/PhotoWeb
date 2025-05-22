import React, { useContext } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Box, 
  Toolbar,
  Collapse,
  ListItemButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { NavbarContext } from '../../contexts/NavbarContext';
import { Link, useLocation } from 'react-router-dom';
import BorderAllIcon from '@mui/icons-material/BorderAll';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import CalculateIcon from '@mui/icons-material/Calculate';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import FlipIcon from '@mui/icons-material/Flip';
import TuneIcon from '@mui/icons-material/Tune';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import PaletteIcon from '@mui/icons-material/Palette';
import HomeIcon from '@mui/icons-material/Home';

const drawerWidth = 300;

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'isExpanded',
})(({ theme, isExpanded }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(isExpanded && {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      overflowX: 'hidden',
    },
  }),
  ...(!isExpanded && {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
    '& .MuiDrawer-paper': {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    },
  }),
}));

const NavLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: 'inherit',
  width: '100%',
  display: 'flex',
}));

function Navbar() {
  const { isExpanded } = useContext(NavbarContext);
  const location = useLocation();
  const [filtersOpen, setFiltersOpen] = React.useState(true);
  const [toolsOpen, setToolsOpen] = React.useState(true);

  const handleFiltersClick = () => {
    setFiltersOpen(!filtersOpen);
  };

  const handleToolsClick = () => {
    setToolsOpen(!toolsOpen);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <StyledDrawer
      variant="permanent"
      isExpanded={isExpanded}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <NavLink to="/">
            <ListItem button selected={isActive('/')}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Início" />
            </ListItem>
          </NavLink>

          <ListItemButton onClick={handleFiltersClick}>
            <ListItemIcon>
              <FilterListIcon />
            </ListItemIcon>
            <ListItemText primary="Filtros" />
            {filtersOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          
          <Collapse in={filtersOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <NavLink to="/border-detector">
                <ListItem button selected={isActive('/border-detector')} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <BorderAllIcon />
                  </ListItemIcon>
                  <ListItemText primary="Detector de Bordas" />
                </ListItem>
              </NavLink>
              
              <NavLink to="/gaussian-filter">
                <ListItem button selected={isActive('/gaussian-filter')} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <BlurOnIcon />
                  </ListItemIcon>
                  <ListItemText primary="Filtro Gaussiano" />
                </ListItem>
              </NavLink>
              
              <NavLink to="/image-cleaner">
                <ListItem button selected={isActive('/image-cleaner')} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <CleaningServicesIcon />
                  </ListItemIcon>
                  <ListItemText primary="Limpeza de Imagem" />
                </ListItem>
              </NavLink>
              
              <NavLink to="/image-highlight">
                <ListItem button selected={isActive('/image-highlight')} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <TuneIcon />
                  </ListItemIcon>
                  <ListItemText primary="Realce de Imagem" />
                </ListItem>
              </NavLink>
            </List>
          </Collapse>

          <Divider sx={{ my: 1 }} />

          <ListItemButton onClick={handleToolsClick}>
            <ListItemIcon>
              <PaletteIcon />
            </ListItemIcon>
            <ListItemText primary="Ferramentas" />
            {toolsOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          
          <Collapse in={toolsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <NavLink to="/color-converter">
                <ListItem button selected={isActive('/color-converter')} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <ColorLensIcon />
                  </ListItemIcon>
                  <ListItemText primary="Conversor de Cores" />
                </ListItem>
              </NavLink>
              
              <NavLink to="/image-calculator">
                <ListItem button selected={isActive('/image-calculator')} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <CalculateIcon />
                  </ListItemIcon>
                  <ListItemText primary="Calculadora de Imagem" />
                </ListItem>
              </NavLink>
              
              <NavLink to="/image-flipper">
                <ListItem button selected={isActive('/image-flipper')} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <FlipIcon />
                  </ListItemIcon>
                  <ListItemText primary="Inversor de Imagem" />
                </ListItem>
              </NavLink>
              
              <NavLink to="/image-normalize">
                <ListItem button selected={isActive('/image-normalize')} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <EqualizerIcon />
                  </ListItemIcon>
                  <ListItemText primary="Normalização de Histograma" />
                </ListItem>
              </NavLink>
            </List>
          </Collapse>
        </List>
      </Box>
    </StyledDrawer>
  );
}

export default Navbar;