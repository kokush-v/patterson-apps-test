import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { UploadedFilesView } from 'src/sections/uploaded-files/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Uploaded files - ${CONFIG.appName}`}</title>
      </Helmet>

      <UploadedFilesView />
    </>
  );
}
