import { ROUTES } from 'src/constants/routes';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Uploaded files',
    path: ROUTES.UPLOADED_FILES,
    icon: icon('ic-folder'),
  },

  {
    title: 'AI Settings',
    path: ROUTES.AI_SETTINGS,
    icon: icon('ic-settings'),
  },
];
