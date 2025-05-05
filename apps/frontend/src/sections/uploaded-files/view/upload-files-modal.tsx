import type { ExtendedFileProps } from 'react-mui-fileuploader/dist/types/index.types';

import { useState } from 'react';
import FileUpload from 'react-mui-fileuploader';

import { Box } from '@mui/system';
import Button from '@mui/material/Button';
import { green } from '@mui/material/colors';
import { CircularProgress } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

import { useToasts } from 'src/hooks/use-toast';

import { ModalWithCloseButton } from 'src/components/modal/modal-with-close-button';

interface UploadFilesModalProps {
  open: boolean;
  handleClose: () => void;
  handleFilesChange: (files: ExtendedFileProps[]) => void;
  onFilesSend: () => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
  readyToSend: boolean;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  borderRadius: '0.5em',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export const UploadFilesModal = ({
  open,
  handleClose,
  handleFilesChange,
  onFilesSend,
  isLoading,
  isSuccess,
  readyToSend,
}: UploadFilesModalProps) => {
  const [isSuccessState, setIsSuccessState] = useState(isSuccess);

  const { showErrorToast } = useToasts();

  const handleFileUploadError = (error: string) => {
    showErrorToast('Error uploading file', error);
  };

  const buttonStyles = {
    width: '100%',
    ...(isSuccess && {
      bgcolor: green[500],
      '&:hover': {
        bgcolor: green[700],
      },
    }),
  };

  return (
    <ModalWithCloseButton
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={style}
    >
      <Box>
        <FileUpload
          getBase64={false}
          multiFile
          disabled={false}
          title=""
          header="Drop files here"
          leftLabel="or"
          rightLabel="to select files"
          buttonLabel="click here"
          buttonRemoveLabel="Remove all"
          maxUploadFiles={0}
          errorSizeMessage="fill it or remove it to use the default error message"
          allowedExtensions={['pdf']}
          onFilesChange={handleFilesChange}
          onError={handleFileUploadError}
          imageSrc="/assets/icons/uploads/cloud-file-upload.svg"
          BannerProps={{ elevation: 0, variant: 'outlined' }}
          showPlaceholderImage
          ContainerProps={{
            elevation: 0,
            variant: 'outlined',
            sx: { p: 1, width: '500px' },
          }}
        />
        <Box sx={{ m: 1, position: 'relative' }}>
          <Button
            disabled={!readyToSend || isLoading}
            variant="contained"
            onClick={async () => {
              await onFilesSend();
              setIsSuccessState(true);
              setTimeout(() => {
                setIsSuccessState(false);
              }, 1000);
            }}
            sx={buttonStyles}
          >
            {isSuccessState ? <CheckIcon /> : 'Upload files'}
          </Button>
          {isLoading && (
            <CircularProgress
              size={24}
              sx={{
                color: 'gray',
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
        </Box>
      </Box>
    </ModalWithCloseButton>
  );
};
