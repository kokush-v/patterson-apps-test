import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { ROUTES } from 'src/constants/routes';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
export const UploadedFilesPage = lazy(() => import('src/pages/uploaded-files'));
export const AiSettingsPage = lazy(() => import('src/pages/ai-settings'));
export const FileConfigurationPage = lazy(() => import('src/pages/file-configuration'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const FileContentPage = lazy(() => import('src/pages/file-content'));

// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  return useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <HomePage />, index: true },
        { path: ROUTES.UPLOADED_FILES, element: <UploadedFilesPage /> },
        { path: ROUTES.AI_SETTINGS, element: <AiSettingsPage /> },
        { path: ROUTES.FILE_CONFIGURATION, element: <FileConfigurationPage /> },
        { path: ROUTES.FILE_CONTENT, element: <FileContentPage /> },
      ],
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
