import { configureStore } from '@reduxjs/toolkit';

import { aiSettingsApi } from './ai-settings/api';
import { uploadedFilesApi } from './uploaded-files/api';

export const store = configureStore({
  reducer: {
    [uploadedFilesApi.reducerPath]: uploadedFilesApi.reducer,
    [aiSettingsApi.reducerPath]: aiSettingsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(uploadedFilesApi.middleware).concat(aiSettingsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
