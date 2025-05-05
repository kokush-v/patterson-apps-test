import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { ENV_VARIABLES } from 'src/constants/env';
import { PDF_ROUTES } from 'src/constants/backend.routes';

import type { IGetMany } from '../types.generic';
import type { UploadedFiles, IUploadedFileUpdate } from './types';

export const uploadedFilesApi = createApi({
  reducerPath: 'uploadedFilesApi',
  tagTypes: ['UploadedFiles'],
  baseQuery: fetchBaseQuery({ baseUrl: ENV_VARIABLES.BAKCEND_URL }),
  endpoints: (builder) => ({
    uploadFiles: builder.mutation<UploadedFiles, FormData>({
      query: (body) => ({
        url: PDF_ROUTES.UPLOAD_FILES,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['UploadedFiles'],
    }),

    deleteFile: builder.mutation<void, string>({
      query: (id) => ({
        url: PDF_ROUTES.DELETE_FILE(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['UploadedFiles'],
    }),

    placeFileInQueue: builder.mutation<UploadedFiles, string>({
      query: (id) => ({
        url: PDF_ROUTES.REGENERATE_FILE(id),
        method: 'PUT',
      }),
      invalidatesTags: ['UploadedFiles'],
    }),

    getUploadedFiles: builder.query<IGetMany<UploadedFiles>, { page: number; limit: number }>({
      query: ({ page, limit }) => ({
        url: `${PDF_ROUTES.GET_FILES}?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['UploadedFiles'],
    }),

    getFileById: builder.query<UploadedFiles, string>({
      query: (id: string) => PDF_ROUTES.GET_FILE_BY_ID(id),
      providesTags: ['UploadedFiles'],
    }),

    saveFile: builder.mutation<UploadedFiles, { id: string; data: Partial<IUploadedFileUpdate> }>({
      query: ({ id, data }) => ({
        url: PDF_ROUTES.UPDATE_FILE(id),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['UploadedFiles'],
    }),
  }),
});

export const {
  useGetUploadedFilesQuery,
  useUploadFilesMutation,
  useDeleteFileMutation,
  usePlaceFileInQueueMutation,
  useGetFileByIdQuery,
  useSaveFileMutation,
} = uploadedFilesApi;
