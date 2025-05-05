import type { ModalProps } from '@mui/material';

import { Box, Modal, Typography } from '@mui/material';

import { Iconify } from '../iconify';

export const ModalWithCloseButton = ({ open, onClose, children, sx, title }: ModalProps) => (
  <Modal
    open={open}
    onClose={onClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    sx={{
      overflow: 'auto',
      padding: '20px',
    }}
  >
    <Box
      sx={{
        position: 'relative',
        border: 'none',
        ...sx,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h3">{title}</Typography>
        <Iconify
          width={40}
          sx={{
            cursor: 'pointer',
            padding: 1,
            color: 'text.secondary',
            position: 'absolute',
            top: 10,
            right: 10,
          }}
          icon="line-md:close"
          onClick={(e) => {
            onClose?.(e, 'backdropClick');
          }}
        />
      </Box>

      {children}
    </Box>
  </Modal>
);
