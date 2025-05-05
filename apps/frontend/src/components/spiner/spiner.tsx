import { forwardRef } from 'react';

import Box from '@mui/material/Box';
import { CircularProgress } from '@mui/material';

import type { SpinerProps } from './types';

// ----------------------------------------------------------------------

export const Spiner = forwardRef<HTMLSpanElement, SpinerProps>(({ size, className }, ref) => (
  <Box
    ref={ref}
    component="span"
    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '25em' }}
  >
    <CircularProgress size={size} className={className || ''} />
  </Box>
));
