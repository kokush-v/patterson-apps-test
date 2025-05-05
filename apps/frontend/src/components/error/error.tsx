import { forwardRef } from 'react';

import Box from '@mui/material/Box';

import { Iconify } from '../iconify';

import type { ErrorProps } from './types';

// ----------------------------------------------------------------------

export const ErrorLable = forwardRef<HTMLSpanElement, ErrorProps>(
  ({ message = 'Something went wrong...', className }, ref) => (
    <Box
      ref={ref}
      component="span"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '25em',
        gap: 1,
        fontSize: 14,
        color: 'error.main',
      }}
    >
      <Iconify width={26} icon="ic:baseline-error-outline" />
      <p>{message}</p>
    </Box>
  )
);
