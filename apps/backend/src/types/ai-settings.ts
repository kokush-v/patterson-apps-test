import { z } from "zod";

export const aiSettingsSchema = z.object({
	id: z.string(),
	splitInvoiceToAttachmentPromt: z.string().default(""),
	analyzeInvoicePromt: z.string().default(""),
	analyzeAttachmentPromt: z.string().default(""),
	summarizePromt: z.string().default(""),
});

export type IAiSettings = z.infer<typeof aiSettingsSchema>;
