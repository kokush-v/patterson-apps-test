import type { AppDispatch } from 'src/store';
import type { AiSettings } from 'src/store/ai-settings/types';

import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';

import { Box, Typography, TextareaAutosize } from '@mui/material';

import { aiSettingsApi } from 'src/store/ai-settings/api';

interface AiSettingsReorderProps {
  data: AiSettings | Record<string, string>;
}

const PropmtsTitles = {
  splitInvoiceToAttachmentPromt: 'Split Invoice to Attachment Prompt',
  analyzeInvoicePromt: 'Analyze Invoice Prompt',
  analyzeAttachmentPromt: 'Analyze Attachment Prompt',
  summarizePromt: 'Summarize Prompt',
};

export const AiSettingsPromptsView = ({ data: { id, ...data } }: AiSettingsReorderProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const updatePrompt = (promtKey: string, prompt: string) => {
    dispatch(
      aiSettingsApi.util.updateQueryData('getAiSettings', null, (draft) => {
        if (draft) {
          draft[promtKey as keyof typeof data] = prompt;
        }
      })
    );
  };
  return (
    <Box
      flex={1}
      gap={3}
      display="flex"
      flexDirection="column"
      my={2}
      bgcolor="white"
      borderRadius={2}
      padding={3}
    >
      {Object.keys(data).map((key) => (
        <TextAreaField
          key={key}
          updatePrompt={updatePrompt}
          value={data[key as keyof typeof data]}
          valueKey={key}
        />
      ))}
    </Box>
  );
};

interface TextAreaFieldProps {
  updatePrompt: (id: string, prompt: string) => void;
  value: string;
  valueKey: string;
}

const TextAreaField = ({ updatePrompt, value, valueKey }: TextAreaFieldProps) => {
  const [text, setText] = useState(value);

  useEffect(() => {
    setText(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setText(newValue);
    updatePrompt(valueKey, newValue);
  };

  return (
    <Box
      paddingX={2}
      borderRadius={1}
      display="flex"
      flexDirection="column"
      paddingY={3}
      position="relative"
      bgcolor="#f9f9f9"
    >
      <Typography
        top="5px"
        left="30px"
        position="absolute"
        bgcolor="#f9f9f9"
        padding={1}
        borderRadius="5px"
        variant="body2"
      >
        {`${PropmtsTitles[valueKey as keyof typeof PropmtsTitles]}:`}
      </Typography>

      <TextareaAutosize
        aria-label="prompt"
        minRows={10}
        style={{
          width: '100%',
          padding: '10px',
          paddingTop: '35px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          backgroundColor: '#f9f9f9',
        }}
        placeholder="Type your prompt here..."
        value={text}
        onChange={handleChange}
      />

      <Box display="flex" justifyContent="space-between" gap={2} mt={2}>
        <Typography mt={2} variant="body2" alignSelf="flex-end">
          {text.length} characters
        </Typography>
      </Box>
    </Box>
  );
};
