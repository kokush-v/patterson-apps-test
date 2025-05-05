import { useParams } from 'react-router-dom';

import { Box, Typography } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { PDF_FILES } from 'src/constants/backend.routes';
import { useGetFileByIdQuery } from 'src/store/uploaded-files/api';

import { PdfViewer } from 'src/components/pdf-viewer/pdf-viewer';
import { MarkdownReader } from 'src/components/markdown-reader/markdown-reader';

export const FileContentView = () => {
  const { id } = useParams();
  const { data: file } = useGetFileByIdQuery(id as string);

  return (
    <DashboardContent>
      <Typography variant="h4" fontWeight={700} mb={3}>
        {file?.filename}
      </Typography>

      <Box display="flex" flexDirection="row" width="100%" height={800} gap={3}>
        <Box
          flex={1}
          height="100%"
          overflow="auto"
          display="flex"
          justifyContent="center"
          alignItems="flex-start"
        >
          <PdfViewer pdfUrl={PDF_FILES(id as string, `${id}.pdf`)} />
        </Box>

        <Box flex={1} height="100%" overflow="auto" borderRadius={2} bgcolor="background.paper">
          <MarkDownTitle>Summary</MarkDownTitle>
          <MarkdownReader markdownContent={file?.summaryAnalyzedData || ''} />
          <MarkDownTitle>Analyzed invoices data</MarkDownTitle>
          <MarkdownReader markdownContent={file?.invoiceAnalyzedData || ''} />
          <MarkDownTitle>Analyzed attachments data</MarkDownTitle>
          <MarkdownReader markdownContent={file?.attachmentAnalyzedData || ''} />
        </Box>
      </Box>
    </DashboardContent>
  );
};

export const MarkDownTitle = ({ children }: { children: React.ReactNode }) => (
  <Typography
    variant="h4"
    fontWeight={700}
    mb={2}
    padding={2}
    borderBottom="1px solid"
    borderColor="divider"
    textAlign="center"
  >
    {children}
  </Typography>
);
