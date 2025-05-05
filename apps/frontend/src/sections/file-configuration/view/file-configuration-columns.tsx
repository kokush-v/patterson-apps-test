import type { AppDispatch } from 'src/store';

import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { grey } from '@mui/material/colors';
import { Box, Typography } from '@mui/material';

import { PDF_FILES } from 'src/constants/backend.routes';
import { uploadedFilesApi } from 'src/store/uploaded-files/api';

import { DragElement } from '../drag-wrapper';

interface ConfigurationColumnProps {
  data: number[];
  title: string;
  columnRef: React.RefObject<HTMLDivElement>;
}

export const ConfigurationColumn = ({ data, title, columnRef }: ConfigurationColumnProps) => {
  const { id } = useParams();

  const dispatch = useDispatch<AppDispatch>();

  const onBlockMove = (nextColumn: string, page: number) => {
    if (!id) return;

    dispatch(
      uploadedFilesApi.util.updateQueryData('getFileById', id, (draft) => {
        const isInvoicesColumn = nextColumn === 'Invoices';
        const fromList = isInvoicesColumn ? draft.invoices : draft.attachments;
        const toList = isInvoicesColumn ? draft.attachments : draft.invoices;

        const movedItemIndex = fromList.findIndex((item) => item === page);

        if (movedItemIndex !== -1) {
          const [movedItem] = fromList.splice(movedItemIndex, 1);
          toList.push(movedItem);

          const sortedFromList = [...fromList].sort((a, b) => a - b);
          const sortedToList = [...toList].sort((a, b) => a - b);

          if (isInvoicesColumn) {
            draft.invoices = sortedFromList;
            draft.attachments = sortedToList;
          } else {
            draft.attachments = sortedFromList;
            draft.invoices = sortedToList;
          }
        }
      })
    );
  };

  return (
    <Box
      bgcolor="background.paper"
      borderRadius={2}
      padding={3}
      width="100%"
      minHeight="min-content"
    >
      <Typography variant="h6" textAlign="center" marginBottom={2}>
        {title}
      </Typography>
      <div
        className="board-column"
        id={title}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          padding: 5,
          borderRadius: 2,
          height: '100%',
        }}
        ref={columnRef}
      >
        {data.map((page, index) => (
          <DragElement
            move={() => {
              onBlockMove(title, page);
            }}
            key={page}
            columnRef={columnRef}
          >
            <Box
              width="300px"
              bgcolor={grey[100]}
              borderRadius={2}
              padding={1}
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={1}
            >
              <img
                style={{ borderRadius: '10px' }}
                src={PDF_FILES(id as string, `page.${page}.png`)}
                alt={`page ${page}`}
                draggable={false}
              />
              <Typography variant="body2">{`Page ${page}`}</Typography>
            </Box>
          </DragElement>
        ))}
      </div>
    </Box>
  );
};
