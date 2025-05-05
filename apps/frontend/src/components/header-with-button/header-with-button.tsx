import { Box, Button, Typography, CircularProgress } from '@mui/material';

import { COLORS } from 'src/theme/colors';

interface HeaderProps {
  isLoading: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}

export const HeaderWithButton = ({ isLoading, onClick, children }: HeaderProps) => (
  <Box
    display="flex"
    alignItems="center"
    padding={3}
    position="sticky"
    top={0}
    bgcolor={COLORS.background.main}
    zIndex={10}
  >
    <Typography flexGrow={1} variant="h4">
      {children}
    </Typography>
    <Button onClick={onClick} variant="outlined">
      {isLoading ? <CircularProgress color="primary" size={20} /> : 'Save'}
    </Button>
  </Box>
);
