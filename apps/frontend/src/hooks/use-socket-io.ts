/* eslint-disable react-hooks/exhaustive-deps */
import type { AppDispatch } from 'src/store';

import { io } from 'socket.io-client';
import { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ENV_VARIABLES } from 'src/constants/env';
import { uploadedFilesApi } from 'src/store/uploaded-files/api';
import { type UploadedFiles } from 'src/store/uploaded-files/types';

export const useFileSockets = (
  file: UploadedFiles,
  tablePaginationValues: { page: number; rowsPerPage: number }
) => {
  const socketRef = useRef<ReturnType<typeof io>>();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (file.uploadedStatus === 'completed') {
      return;
    }

    const socket = io(ENV_VARIABLES.BAKCEND_URL, {
      query: {
        id: file.id,
      },
    });

    socketRef.current = socket;

    socket.on('file-statuses:update', (data) => {
      dispatch(
        uploadedFilesApi.util.updateQueryData(
          'getUploadedFiles',
          { page: tablePaginationValues.page + 1, limit: tablePaginationValues.rowsPerPage },
          ({ data: filesData }) => {
            const findedFile = filesData.find((f) => f.id === file.id);

            if (findedFile) {
              findedFile.uploadedStatus = data.uploadedStatus;
              findedFile.matchedStatus = data.matchedStatus || findedFile.matchedStatus;
            }
          }
        )
      );
    });

    // eslint-disable-next-line consistent-return
    return () => {
      socket.disconnect();
    };
  }, [file.id, file.uploadedStatus]);
};
