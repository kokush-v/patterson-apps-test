import { UploadedFile } from "@prisma/client";
import { IFindMany } from "../types/generics";
import { mistralAIService } from "./mistral-ai.service";
import { prisma } from "./prisma.service";
import {
	chatSplitFunctionResponseSchema,
	IUploadedFileUpdate,
	UploadedFileMatchedStatus,
	UploadedFileStatus,
} from "../types/pdf.types";
import { socketIO } from "../configurations/socket.io";
import { aiSettingsService } from "./ai-settings.service";
import { extractJsonFromString } from "../utils/json-extractor";
import { OCRPageObject, OCRResponse } from "@mistralai/mistralai/models/components";
import { PageTypes } from "../types/mistal-ai";
import { languageModelService } from "./language-model.service";

class PdfService {
	private readonly uploadedFilesRepository = prisma.uploadedFile;

	async pdfAnalyzeService(): Promise<void> {
		try {
			const fileInUpload = await this.uploadedFilesRepository.findFirst({
				where: {
					uploadedStatus: UploadedFileStatus.Processing,
				},
			});

			if (fileInUpload) {
				const ocrResult = await mistralAIService.getOcrFromPdf(fileInUpload.id);

				const { splitInvoiceToAttachmentPromt } = await aiSettingsService.getAiSetting();

				const prompt = `${splitInvoiceToAttachmentPromt}
					
					Input data:
					${JSON.stringify(ocrResult.pages, null, 2)}
					`;

				const chatAnser = await languageModelService.useChat(prompt);
				const parsedAnswer = extractJsonFromString(chatAnser);

				const validatedData = chatSplitFunctionResponseSchema.parse(parsedAnswer);

				await this.uploadedFilesRepository.update({
					data: {
						ocrResult: JSON.stringify(ocrResult),
						uploadedStatus: UploadedFileStatus.WaitingForApproval,
						invoices: validatedData.invoices,
						attachments: validatedData.attachment,
					},
					where: {
						id: fileInUpload.id,
					},
				});

				socketIO.getIO().to(fileInUpload.id).emit("file-statuses:update", {
					uploadedStatus: UploadedFileStatus.WaitingForApproval,
				});
			}
		} catch (e) {
			console.log(e);
		} finally {
			setTimeout(() => {
				this.pdfAnalyzeService();
			}, 15000);
		}
	}

	async pdfScanService() {
		try {
			const fileInPending = await this.uploadedFilesRepository.findFirst({
				where: {
					uploadedStatus: {
						in: [UploadedFileStatus.Failed, UploadedFileStatus.InProgress],
					},
				},
			});

			if (fileInPending) {
				try {
					await this.updateUploadStatusById(fileInPending.id, UploadedFileStatus.InProgress);
					const ocrData = JSON.parse(fileInPending.ocrResult) as OCRResponse;

					let finalPrompt = "";
					let invoiceAnalyzedData = "";
					let attachmentAnalyzedData = "";

					for (const invoiceId of fileInPending.invoices) {
						const page = ocrData.pages.find((page) => page.index + 1 === invoiceId);

						if (page) {
							const pageDescription = await this.getPagesDescription(page, PageTypes.Invoice);
							invoiceAnalyzedData += `${pageDescription}\n`;
						}
					}

					for (const attachmentId of fileInPending.attachments) {
						const page = ocrData.pages.find((page) => page.index + 1 === attachmentId);

						if (page) {
							const pageDescription = await this.getPagesDescription(page, PageTypes.Attachment);
							attachmentAnalyzedData += `${pageDescription}\n`;
						}
					}

					finalPrompt += `
						Invoice analyzed data:
						${invoiceAnalyzedData}

						Attachment analyzed data:
						${attachmentAnalyzedData}

						Also if data mathces, please provide the matched status as last word in the response in lower case.

						here is enum which i used to check the matched status:
						${JSON.stringify(UploadedFileMatchedStatus, null, 2)}
						`;

					const description = await this.getPdfSummary(finalPrompt);

					const matchedStatus = description
						.match(/(matched|not matched|match)/i)?.[0]
						.toLowerCase() as UploadedFileMatchedStatus;

					console.log(matchedStatus);

					await this.uploadedFilesRepository.update({
						data: {
							summaryAnalyzedData: description,

							uploadedStatus: UploadedFileStatus.Completed,
							matchedStatus,

							invoiceAnalyzedData: invoiceAnalyzedData,
							attachmentAnalyzedData: attachmentAnalyzedData,
						},
						where: {
							id: fileInPending.id,
						},
					});

					socketIO.getIO().to(fileInPending.id).emit("file-statuses:update", {
						uploadedStatus: UploadedFileStatus.Completed,
						matchedStatus,
					});

					console.log(`File ${fileInPending.id} processed`);
				} catch (e) {
					await this.updateUploadStatusById(fileInPending.id, UploadedFileStatus.Failed);
					console.log(`Error processing file ${fileInPending.id}`);
				}
			}
		} catch (e) {
			console.log(e);
		} finally {
			setTimeout(() => {
				this.pdfScanService();
			}, 15000);
		}
	}

	async saveFiles(files: UploadedFile[]): Promise<number> {
		for (const file of files) {
			await this.uploadedFilesRepository.upsert({
				where: { id: file.id },
				update: {},
				create: file,
			});
		}

		return files.length;
	}

	async getFiles(limit: number, page: number): Promise<IFindMany<UploadedFile>> {
		const totalCount = await this.uploadedFilesRepository.count();
		const uploadedFiles = await this.uploadedFilesRepository.findMany({ take: limit, skip: (page - 1) * limit });

		return {
			page,
			data: uploadedFiles,
			totalCount: totalCount,
		};
	}

	async updateUploadStatusById(id: string, status: string): Promise<void> {
		socketIO.getIO().to(id).emit("file-statuses:update", {
			uploadedStatus: status,
		});

		await this.uploadedFilesRepository.update({
			data: {
				uploadedStatus: status,
			},
			where: {
				id: id,
			},
		});
	}

	async deleteFile(id: string): Promise<UploadedFile | null> {
		const deletedFile = await this.uploadedFilesRepository.delete({
			where: {
				id: id,
			},
		});

		return deletedFile;
	}

	async getFileById(id: string): Promise<UploadedFile | null> {
		const file = await this.uploadedFilesRepository.findFirst({
			where: {
				id: id,
			},
		});

		return file;
	}

	async updateFile(id: string, data: IUploadedFileUpdate): Promise<UploadedFile | null> {
		const updateData = Object.entries(data).reduce(
			(acc, [key, value]) => {
				if (value !== undefined) {
					acc[key] = value;
				}
				return acc;
			},
			{} as Record<string, unknown>
		) as Partial<IUploadedFileUpdate>;

		return this.uploadedFilesRepository.update({
			data: updateData,
			where: { id },
		});
	}

	async getPagesDescription(page: OCRPageObject, type: PageTypes): Promise<string> {
		const { analyzeAttachmentPromt, analyzeInvoicePromt } = await aiSettingsService.getAiSetting();

		const prompt = `${type === PageTypes.Invoice ? analyzeInvoicePromt : analyzeAttachmentPromt}
		
			${JSON.stringify(page, null, 2)}
			`.trim();

		const response = await languageModelService.useChat(prompt);

		return response;
	}

	async getPdfSummary(description: string): Promise<string> {
		const { summarizePromt } = await aiSettingsService.getAiSetting();

		const prompt = `${summarizePromt}

			${description}
			`.trim();

		const response = await languageModelService.useChat(prompt);

		return response;
	}
}

export const pdfService = new PdfService();
