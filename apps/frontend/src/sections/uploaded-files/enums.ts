import { UploadedFileStatus, UploadedFileMatchedStatus } from 'src/store/uploaded-files/types';

export const UploadStatusesValues = {
  [UploadedFileStatus.Processing]: 'Processing',

  [UploadedFileStatus.WaitingForApproval]: 'Waiting for Approval',

  [UploadedFileStatus.InProgress]: 'In Progress',

  [UploadedFileStatus.Failed]: 'Failed',
  [UploadedFileStatus.Completed]: 'Completed',
};

export const UploadStatusesColors = {
  [UploadedFileStatus.Processing]: 'info',

  [UploadedFileStatus.WaitingForApproval]: 'warning',

  [UploadedFileStatus.InProgress]: 'info',

  [UploadedFileStatus.Failed]: 'error',
  [UploadedFileStatus.Completed]: 'success',
};

export const UploadedFilesMatchedStatusValues = {
  [UploadedFileMatchedStatus.InProgress]: 'In Progress',
  [UploadedFileMatchedStatus.Match]: 'Match',
  [UploadedFileMatchedStatus.NoMatch]: 'No Match',
};

export const UploadedFilesMatchedStatusColors = {
  [UploadedFileMatchedStatus.InProgress]: 'info',
  [UploadedFileMatchedStatus.Match]: 'success',
  [UploadedFileMatchedStatus.NoMatch]: 'error',
};
