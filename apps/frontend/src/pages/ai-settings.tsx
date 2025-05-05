import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { AiSettingsView } from 'src/sections/ai-settings/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`AI Settings - ${CONFIG.appName}`}</title>
      </Helmet>

      <AiSettingsView />
    </>
  );
}
