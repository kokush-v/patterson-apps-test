import 'react-pdf/dist/Page/TextLayer.css';
import 'yet-another-react-lightbox/styles.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';

import React, { useState } from 'react';
import { Page, pdfjs, Document } from 'react-pdf';

import { Box } from '@mui/material';

import { ErrorLable } from '../error/error';
import ControlPanel from './pdf-control-panel';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PdfViewerProps {
  pdfUrl: string;
}

export const PdfViewer = ({ pdfUrl }: PdfViewerProps) => {
  const [scale, setScale] = useState(0.8);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);

  function onDocumentLoadSuccess(document: PDFDocumentProxy) {
    setNumPages(document.numPages);
    setPageNumber(1);
  }

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      borderRadius={2}
      overflow="hidden"
    >
      <ControlPanel
        scale={scale}
        setScale={setScale}
        numPages={numPages}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
      />
      <Box padding={2} bgcolor="background.paper" flexGrow={1} overflow="auto">
        <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} error={<ErrorLable />}>
          <Box
            display="flex"
            justifyContent="center"
            mt={2}
            sx={{
              width: 'fit-content',
              minWidth: '100%',
            }}
          >
            <Page pageNumber={pageNumber} scale={scale} />
          </Box>
        </Document>
      </Box>
    </Box>
  );
};
