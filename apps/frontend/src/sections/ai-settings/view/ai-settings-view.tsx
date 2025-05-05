import { useToasts } from 'src/hooks/use-toast';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetAiSettingsQuery, useUpdateAiSettingsMutation } from 'src/store/ai-settings/api';

import { Spiner } from 'src/components/spiner/spiner';
import { ErrorLable } from 'src/components/error/error';
import { HeaderWithButton } from 'src/components/header-with-button/header-with-button';

import { AiSettingsPromptsView } from './ai-settings-prompts';

export const AiSettingsView = () => {
  const { showErrorToast, showSuccessToast } = useToasts();

  const {
    currentData,
    data,
    isLoading: dataLoading,
    isError: dataError,
  } = useGetAiSettingsQuery(null);
  const [saveSettings, { isLoading: dataSubmiting }] = useUpdateAiSettingsMutation();

  const handleSave = () => {
    if (!currentData) {
      showErrorToast('No data to save', 'Please make sure you have data to save');
      return;
    }

    saveSettings(currentData)
      .unwrap()
      .then(() => {
        showSuccessToast('AI settings saved', 'Your AI settings have been saved successfully');
      })
      .catch((error) => {
        showErrorToast(
          'Failed to save AI settings',
          'An error occurred while saving your AI settings'
        );
      });
  };

  return (
    <DashboardContent disablePadding fullContent>
      <HeaderWithButton isLoading={dataSubmiting} onClick={handleSave}>
        AI Settings
      </HeaderWithButton>
      {dataError ? (
        <ErrorLable />
      ) : !data || dataLoading ? (
        <Spiner />
      ) : (
        <AiSettingsPromptsView data={data} />
      )}
    </DashboardContent>
  );
};
