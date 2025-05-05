import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { FileContentView } from 'src/sections/file-content/view/file-content-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`File Content - ${CONFIG.appName}`}</title>
      </Helmet>

      <FileContentView />
    </>
  );
}
