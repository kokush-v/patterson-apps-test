export interface UploadedFiles {
  id: string;
  bytes: number;
  created_at: number;
  filename: string;
  ocrResult: string;

  matchedStatus: UploadedFileMatchedStatus;
  uploadedStatus: UploadedFileStatus;

  invoiceAnalyzedData: string;
  attachmentAnalyzedData: string;
  summaryAnalyzedData: string;

  invoices: number[];
  attachments: number[];
}

export enum UploadedFileStatus {
  Processing = 'processing',

  WaitingForApproval = 'waiting_for_approval',

  InProgress = 'in_progress',

  Failed = 'failed',
  Completed = 'completed',
}

export enum UploadedFileMatchedStatus {
  InProgress = 'in_progress',
  Match = 'match',
  NoMatch = 'no_match',
}

export interface IUploadedFileUpdate {
  uploadedStatus?: UploadedFileStatus;
  summaryAnalyzedData?: string;
  ocrResult?: string;
  invoices?: number[];
  attachments?: number[];
}
