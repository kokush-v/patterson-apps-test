import type { LabelColor } from 'src/components/label';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { useRouter } from 'src/routes/hooks';

import { useToasts } from 'src/hooks/use-toast';
import { useFileSockets } from 'src/hooks/use-socket-io';

import { formatBytes } from 'src/utils/format-size';

import { ROUTES } from 'src/constants/routes';
import { UploadedFileStatus, type UploadedFiles } from 'src/store/uploaded-files/types';
import { useDeleteFileMutation, usePlaceFileInQueueMutation } from 'src/store/uploaded-files/api';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import {
  UploadStatusesColors,
  UploadStatusesValues,
  UploadedFilesMatchedStatusColors,
  UploadedFilesMatchedStatusValues,
} from './enums';

// ----------------------------------------------------------------------

type UploadedFilesRowProps = {
  row: UploadedFiles;
  selected: boolean;
  onSelectRow: () => void;
  tablePaginationValues: { page: number; rowsPerPage: number };
};

export function UploadedFilesTableRow({
  row,
  selected,
  onSelectRow,
  tablePaginationValues,
}: UploadedFilesRowProps) {
  const { showSuccessToast, showErrorToast, showInfoToast } = useToasts();
  const router = useRouter();

  useFileSockets(row, tablePaginationValues);

  const [deleteFile] = useDeleteFileMutation();
  const [placeFileInQueue] = usePlaceFileInQueueMutation();

  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleDeleteFile = async () => {
    handleClosePopover();
    deleteFile(row.id)
      .unwrap()
      .then(() => {
        showSuccessToast('File deleted', 'The file was successfully deleted');
      })
      .catch(() => {
        showErrorToast('Error', 'An error occurred while deleting the file');
      });
  };

  const handleRefreshFile = async () => {
    handleClosePopover();
    placeFileInQueue(row.id);
  };

  const UploadedFilesOnClick = {
    [UploadedFileStatus.Processing]: () => {
      showInfoToast('Info', 'The file is still being processed');
    },
    [UploadedFileStatus.WaitingForApproval]: (id: string) => {
      router.push(ROUTES.FILE_CONFIGURATION.replace(':id', id));
    },
    [UploadedFileStatus.InProgress]: () => {
      showInfoToast('Info', 'The file is still being processed');
    },
    [UploadedFileStatus.Failed]: () => {
      showErrorToast('Error', 'The file failed to process. Wait or manually reprocess it');
    },
    [UploadedFileStatus.Completed]: (id: string) => {
      router.push(ROUTES.FILE_CONTENT.replace(':id', id));
    },
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell>
          <Label color={UploadedFilesMatchedStatusColors[row.matchedStatus] as LabelColor}>
            {UploadedFilesMatchedStatusValues[row.matchedStatus]}
          </Label>
        </TableCell>

        <TableCell component="th" scope="row">
          <Box
            onClick={() => UploadedFilesOnClick[row.uploadedStatus](row.id)}
            gap={2}
            display="flex"
            alignItems="center"
            sx={{ cursor: 'pointer' }}
          >
            {row.filename}
          </Box>
        </TableCell>

        <TableCell>{formatBytes(row.bytes)}</TableCell>

        <TableCell>
          <Label color={UploadStatusesColors[row.uploadedStatus] as LabelColor}>
            {UploadStatusesValues[row.uploadedStatus]}
          </Label>
        </TableCell>

        <TableCell>
          {row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : 'Invalid Date'}
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleDeleteFile} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
          <MenuItem onClick={handleRefreshFile} sx={{ color: 'info.main' }}>
            <Iconify icon="solar:refresh-bold" />
            Regenerate
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
