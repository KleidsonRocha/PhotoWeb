import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableRow,
  Divider,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FilterListIcon from '@mui/icons-material/FilterList';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  overflow: 'auto',
}));

const KernelCell = styled(TableCell)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(1),
  fontFamily: 'monospace',
  fontSize: '0.9rem',
  fontWeight: 'bold',
  minWidth: '50px',
}));

const KernelTitle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

function KernelDisplay({ kernel }) {
  // Verifica se o kernel tem matrizes X e Y (como Sobel, Prewitt) ou apenas uma matriz (como Laplaciano)
  const hasXYKernels = kernel && kernel.x && kernel.y;
  
  const renderKernelMatrix = (matrix, title) => (
    <Box sx={{ mb: 3 }}>
      {title && (
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
          {title}
        </Typography>
      )}
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableBody>
            {matrix.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((value, cellIndex) => (
                  <KernelCell key={cellIndex}>
                    {typeof value === 'number' ? 
                      (Number.isInteger(value) ? value : value.toFixed(2)) : 
                      value}
                  </KernelCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <StyledPaper>
      <KernelTitle variant="h6">
        <FilterListIcon color="primary" />
        {kernel.name || "Kernel de Convolução"}
        <Chip 
          label={hasXYKernels ? "Operador Direcional" : "Operador Isotrópico"} 
          size="small" 
          color="primary" 
          variant="outlined"
          sx={{ ml: 1 }}
        />
      </KernelTitle>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {hasXYKernels ? (
          <>
            {renderKernelMatrix(kernel.x, "Componente X (Horizontal)")}
            {renderKernelMatrix(kernel.y, "Componente Y (Vertical)")}
          </>
        ) : (
          renderKernelMatrix(kernel.matrix || kernel, null)
        )}
      </Box>

      <Divider sx={{ my: 2 }} />
      
      <Typography variant="body2" color="text.secondary">
        {hasXYKernels ? (
          "Este operador utiliza duas matrizes de convolução para detectar bordas em direções horizontais e verticais. O resultado final é calculado combinando as duas componentes."
        ) : (
          "Este operador utiliza uma única matriz de convolução para detectar bordas em todas as direções simultaneamente."
        )}
      </Typography>
    </StyledPaper>
  );
}

export default KernelDisplay;