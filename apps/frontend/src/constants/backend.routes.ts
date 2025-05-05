import { ENV_VARIABLES } from './env';

export const PDF_ROUTES = {
  GET_FILES: 'pdf/getFiles',
  UPLOAD_FILES: 'pdf/uploadFiles',
  DELETE_FILE: (id: string) => `pdf/deleteFile/${id}`,
  REGENERATE_FILE: (id: string) => `pdf/regenerateFile/${id}`,
  GET_FILE_BY_ID: (id: string) => `pdf/getFile/${id}`,
  UPDATE_FILE: (id: string) => `pdf/updateFile/${id}`,
};

export const AI_SETTINGS_ROUTES = {
  GET_AI_SETTING: 'ai-settings/getSetting',
  UPDATE_AI_SETTING: 'ai-settings/updateSetting',
};

export const PDF_FILES = (fileId: string, fileName: string) =>
  `${ENV_VARIABLES.BAKCEND_URL}/pdf/${fileId}/${fileName}`;
