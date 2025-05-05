import type { UploadedFiles } from 'src/store/uploaded-files/types';
import type { ExtendedFileProps } from 'react-mui-fileuploader/dist/types/index.types';

import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { useToasts } from 'src/hooks/use-toast';

import { DashboardContent } from 'src/layouts/dashboard';
import { useUploadFilesMutation, useGetUploadedFilesQuery } from 'src/store/uploaded-files/api';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { Spiner } from 'src/components/spiner/spiner';
import { ErrorLable } from 'src/components/error/error';

import { TableNoData } from '../table-no-data';
import { TableEmptyRows } from '../table-empty-rows';
import { UploadFilesModal } from './upload-files-modal';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { UserTableToolbar } from '../uploaded-files-table-toolbar';
import { UploadedFilesTableRow } from '../uploaded-files-table-row';
import { UploadedFilesTableHead } from '../uploaded-files-table-head';

// ----------------------------------------------------------------------

export function UploadedFilesView() {
  const { showErrorToast, showSuccessToast } = useToasts();

  const table = useTable();

  const { data, isError, isFetching } = useGetUploadedFilesQuery({
    page: table.page + 1,
    limit: table.rowsPerPage,
  });

  const responseData = useMemo<UploadedFiles[]>(() => (data ? data.data : []), [data]);

  const [uploadFiles, { isLoading, isSuccess, reset }] = useUploadFilesMutation();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [filterName, setFilterName] = useState('');

  const [files, setFiles] = useState<ExtendedFileProps[]>([]);

  const dataFiltered: UploadedFiles[] = applyFilter({
    inputData: responseData,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleFilesChange = (uploadedFiles: ExtendedFileProps[]) => {
    setFiles([...uploadedFiles]);
  };

  const onFilesSend = async (): Promise<void> => {
    const form = new FormData();

    files.forEach((file) => {
      form.append('files', file);
    });

    try {
      await uploadFiles(form).unwrap();
      setTimeout(() => {
        setIsUploadModalOpen(false);
        reset();
      }, 1000);

      showSuccessToast('Success', 'Files uploaded successfully');
    } catch (error) {
      showErrorToast('Error', 'Failed to upload files');
    }
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Uploaded Files
        </Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:file-export-line" />}
          onClick={() => {
            setIsUploadModalOpen(true);
          }}
        >
          Upload file
        </Button>
        <UploadFilesModal
          open={isUploadModalOpen}
          handleClose={() => {
            setIsUploadModalOpen(false);
          }}
          handleFilesChange={handleFilesChange}
          onFilesSend={onFilesSend}
          isLoading={isLoading}
          isSuccess={isSuccess}
          readyToSend={files.length > 0}
        />
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            {isFetching ? (
              <Spiner />
            ) : isError ? (
              <ErrorLable />
            ) : (
              <Table sx={{ minWidth: 800 }}>
                <UploadedFilesTableHead
                  order={table.order}
                  orderBy={table.orderBy}
                  rowCount={responseData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      responseData.map((user) => user.id)
                    )
                  }
                  headLabel={[
                    { id: 'match_status', label: 'Match status' },
                    { id: 'filename', label: 'Filename' },
                    { id: 'bytes', label: 'Size' },
                    { id: 'status', label: 'Uploaded status' },
                    { id: 'created_at', label: 'Created at' },
                    { id: '' },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <UploadedFilesTableRow
                        tablePaginationValues={{ page: table.page, rowsPerPage: table.rowsPerPage }}
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={68}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, responseData.length)}
                  />

                  {notFound && <TableNoData searchQuery={filterName} />}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={responseData.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
