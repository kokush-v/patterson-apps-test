import { z } from "zod";

export interface IUploadedFile extends ChatSplitFunctionResponse {
	id: string;
	bytes: number;
	created_at: number;
	filename: string;

	matchedStatus: string;
	uploadedStatus: UploadedFileStatus;

	summaryAnalyzedData: string;
	invoiceAnalyzedData: string;
	attachmentAnalyzedData: string;

	ocrResult: string;
}

export enum UploadedFileStatus {
	Processing = "processing",

	WaitingForApproval = "waiting_for_approval",

	InProgress = "in_progress",

	Failed = "failed",
	Completed = "completed",
}

export enum UploadedFileMatchedStatus {
	InProgress = "in_progress",
	Match = "match",
	NoMatch = "no_match",
}

export const chatSplitFunctionResponseSchema = z.object({
	invoices: z.array(z.number()),
	attachment: z.array(z.number()),
});

export type ChatSplitFunctionResponse = z.infer<typeof chatSplitFunctionResponseSchema>;

export const uploadedFileUpdateSchema = z.object({
	uploadedStatus: z.nativeEnum(UploadedFileStatus).optional(),
	matchedStatus: z.nativeEnum(UploadedFileMatchedStatus).optional(),
	summaryAnalyzedData: z.string().optional(),
	ocrResult: z.string().optional(),
	invoices: z.array(z.number()).optional(),
	attachments: z.array(z.number()).optional(),
});

export interface IUploadedFileUpdate extends z.infer<typeof uploadedFileUpdateSchema> {}
