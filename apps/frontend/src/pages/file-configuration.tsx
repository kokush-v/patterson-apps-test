import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { FileConfigurationView } from 'src/sections/file-configuration/view/file-configuration-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`File Configuration - ${CONFIG.appName}`}</title>
      </Helmet>

      <FileConfigurationView />
    </>
  );
}
