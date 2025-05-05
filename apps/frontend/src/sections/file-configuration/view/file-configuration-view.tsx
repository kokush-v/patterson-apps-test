import { useRef } from 'react';
import { useParams } from 'react-router-dom';

import { Box } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { useToasts } from 'src/hooks/use-toast';

import { ROUTES } from 'src/constants/routes';
import { DashboardContent } from 'src/layouts/dashboard';
import { UploadedFileStatus } from 'src/store/uploaded-files/types';
import { useGetFileByIdQuery, useSaveFileMutation } from 'src/store/uploaded-files/api';

import { Spiner } from 'src/components/spiner/spiner';
import { ErrorLable } from 'src/components/error/error';
import { HeaderWithButton } from 'src/components/header-with-button/header-with-button';

import { ConfigurationColumn } from './file-configuration-columns';

export const FileConfigurationView = () => {
  const refs = {
    invoiceColumn: useRef(null),
    attachmentsColumn: useRef(null),
  };

  const { id } = useParams();
  const router = useRouter();
  const { showErrorToast, showSuccessToast } = useToasts();

  const { data: file, isLoading, isError, currentData } = useGetFileByIdQuery(id as string);
  const [updateFile, { isLoading: isUpdating }] = useSaveFileMutation();

  const onApprove = () => {
    if (currentData) {
      const { attachments, invoices } = currentData;

      updateFile({
        id: id as string,
        data: { attachments, invoices, uploadedStatus: UploadedFileStatus.InProgress },
      })
        .unwrap()
        .then(() => {
          showSuccessToast('Success', 'File updated successfully');
          router.push(ROUTES.UPLOADED_FILES);
        })
        .catch((error) => {
          showErrorToast('Error updating file', 'Please try again later');
        });
    }
  };

  return (
    <DashboardContent disablePadding fullContent>
      <HeaderWithButton isLoading={isUpdating} onClick={onApprove}>
        {file?.filename}
      </HeaderWithButton>
      {isLoading ? (
        <Spiner />
      ) : !file || isError ? (
        <ErrorLable />
      ) : (
        <Box display="flex" justifyContent="space-around" paddingX={3} paddingY={2} gap={3}>
          <ConfigurationColumn
            columnRef={refs.invoiceColumn}
            title="Invoices"
            data={file.invoices}
          />
          <ConfigurationColumn
            columnRef={refs.attachmentsColumn}
            title="Attachments"
            data={file.attachments}
          />
        </Box>
      )}
    </DashboardContent>
  );
};
