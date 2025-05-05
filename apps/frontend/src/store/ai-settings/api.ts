import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { ENV_VARIABLES } from 'src/constants/env';
import { AI_SETTINGS_ROUTES } from 'src/constants/backend.routes';

import type { AiSettings } from './types';

const initData: AiSettings = {
  id: '',
  splitInvoiceToAttachmentPromt: '',
  analyzeInvoicePromt: '',
  analyzeAttachmentPromt: '',
  summarizePromt: '',
};

export const aiSettingsApi = createApi({
  reducerPath: 'aiSettingsApi',
  tagTypes: ['AiSettings'],
  baseQuery: fetchBaseQuery({ baseUrl: ENV_VARIABLES.BAKCEND_URL }),
  endpoints: (builder) => ({
    getAiSettings: builder.query<AiSettings, null>({
      query: () => ({
        url: AI_SETTINGS_ROUTES.GET_AI_SETTING,
        method: 'GET',
      }),
      providesTags: ['AiSettings'],

      transformResponse(baseQueryReturnValue: AiSettings) {
        const data = baseQueryReturnValue;

        if (!data) {
          return initData;
        }

        return data;
      },
    }),

    updateAiSettings: builder.mutation<AiSettings, AiSettings>({
      query: (body) => ({
        url: AI_SETTINGS_ROUTES.UPDATE_AI_SETTING,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AiSettings'],
    }),
  }),
});

export const { useGetAiSettingsQuery, useUpdateAiSettingsMutation } = aiSettingsApi;
