import type { ButtonProps } from '@mui/material';

import { Button } from '@mui/material';

interface IconButtonProps extends ButtonProps {
  icon: React.ReactNode;
}

export const IconButton = ({ icon, ...props }: IconButtonProps) => (
  <Button sx={{ minWidth: '32px' }} {...props}>
    {icon}
  </Button>
);
