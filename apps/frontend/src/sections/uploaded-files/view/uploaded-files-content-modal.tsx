import { MarkdownReader } from 'src/components/markdown-reader/markdown-reader';
import { ModalWithCloseButton } from 'src/components/modal/modal-with-close-button';

interface UploadedFilesContentModalProps {
  open: boolean;
  handleClose: () => void;
  content: string;
}

const style = {
  position: 'absolute',
  left: '25%',
  borderRadius: '.5em',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  width: 1000,
  minHeight: 800,
};

export const UploadedFilesContentModal = ({
  open,
  handleClose,
  content,
}: UploadedFilesContentModalProps) => (
  <ModalWithCloseButton
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    sx={style}
    title="Uploaded File Content"
  >
    <MarkdownReader markdownContent={content} />
  </ModalWithCloseButton>
);
