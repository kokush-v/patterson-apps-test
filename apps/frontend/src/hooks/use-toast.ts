import { useToast as useChakraToast } from '@chakra-ui/react';

export const useToasts = () => {
  const chakraToast = useChakraToast();

  const position = 'top-right';

  const showSuccessToast = (title: string, description: string) => {
    chakraToast({
      title,
      description,
      status: 'success',
      duration: 5000,
      isClosable: true,
      position,
    });
  };

  const showErrorToast = (title: string, description: string) => {
    chakraToast({
      title,
      description,
      status: 'error',
      duration: 5000,
      isClosable: true,
      position,
    });
  };

  const showInfoToast = (title: string, description: string) => {
    chakraToast({
      title,
      description,
      status: 'info',
      duration: 5000,
      isClosable: true,
      position,
    });
  };

  const showWarningToast = (title: string, description: string) => {
    chakraToast({
      title,
      description,
      status: 'warning',
      duration: 5000,
      isClosable: true,
      position,
    });
  };

  return {
    showSuccessToast,
    showErrorToast,
    showInfoToast,
    showWarningToast,
  };
};
