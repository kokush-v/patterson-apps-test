import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Uploaded files',
    path: '/uploaded-files',
    icon: icon('ic-folder'),
  },

  {
    title: 'AI Settings',
    path: '/ai-settings',
    icon: icon('ic-settings'),
  },
];
