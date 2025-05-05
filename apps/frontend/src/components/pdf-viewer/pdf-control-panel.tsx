import React from 'react';
import {
  FaForward,
  FaBackward,
  FaSearchPlus,
  FaSearchMinus,
  FaStepForward,
  FaStepBackward,
} from 'react-icons/fa';

import { Box } from '@mui/material';
import { grey } from '@mui/material/colors';

import { IconButton } from './icon-button';

interface ControlPanelProps {
  pageNumber: number;
  numPages: number;
  setPageNumber: (page: number) => void;
  scale: number;
  setScale: (scale: number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  pageNumber,
  numPages,
  setPageNumber,
  scale,
  setScale,
}) => {
  const isFirstPage = pageNumber <= 1;
  const isLastPage = pageNumber === numPages;

  const goToFirstPage = () => {
    if (!isFirstPage) setPageNumber(1);
  };

  const goToPreviousPage = () => {
    if (!isFirstPage) setPageNumber(pageNumber - 1);
  };

  const goToNextPage = () => {
    if (!isLastPage) setPageNumber(pageNumber + 1);
  };

  const goToLastPage = () => {
    if (!isLastPage) setPageNumber(numPages);
  };

  const isMinZoom = scale < 0.6;
  const isMaxZoom = scale >= 2.0;

  const zoomOut = () => {
    if (!isMinZoom) setScale(parseFloat((scale - 0.1).toFixed(2)));
  };

  const zoomIn = () => {
    if (!isMaxZoom) setScale(parseFloat((scale + 0.1).toFixed(2)));
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      flexDirection="row"
      padding={1}
      bgcolor={grey[100]}
      position="sticky"
      top={0}
      zIndex={10}
      width="100%"
    >
      <Box display="flex" alignItems="center" gap={1}>
        <IconButton icon={<FaBackward />} disabled={isFirstPage} onClick={goToFirstPage} />
        <IconButton icon={<FaStepBackward />} disabled={isFirstPage} onClick={goToPreviousPage} />
        <span>
          Page {pageNumber} of {numPages}
        </span>
        <IconButton icon={<FaStepForward />} disabled={isLastPage} onClick={goToNextPage} />
        <IconButton icon={<FaForward />} disabled={isLastPage} onClick={goToLastPage} />
      </Box>

      <Box display="flex" alignItems="center" gap={1}>
        <IconButton icon={<FaSearchMinus />} disabled={isMinZoom} onClick={zoomOut} />
        <span>{(scale * 100).toFixed()}%</span>
        <IconButton icon={<FaSearchPlus />} disabled={isMaxZoom} onClick={zoomIn} />
      </Box>
    </Box>
  );
};

export default ControlPanel;
