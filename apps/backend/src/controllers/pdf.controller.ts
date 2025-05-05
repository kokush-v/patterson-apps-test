import { Request, Response } from "express";
import { ERROR } from "../constants/errors";
import { mistralAIService } from "../services/mistral-ai.service";
import { UploadedFile } from "@prisma/client";
import { pdfService } from "../services/pdf.service";
import {
	IUploadedFileUpdate,
	UploadedFileMatchedStatus,
	UploadedFileStatus,
	uploadedFileUpdateSchema,
} from "../types/pdf.types";
import { pdfToImgService } from "../services/pdf-to-img.service";

class PdfController {
	async uploadFiles(req: Request, res: Response) {
		const files = req.files as Express.Multer.File[];

		if (files.length === 0) {
			throw new Error(ERROR.FILE_NOT_UPLOADED);
		}

		const uploadedFiles: UploadedFile[] = await Promise.all(
			files.map(async (file) => {
				const { id, filename, sizeBytes, createdAt } = await mistralAIService.uploadFile(file);

				return {
					id,
					filename,
					bytes: sizeBytes,
					created_at: new Date(createdAt * 1000),
					uploadedStatus: UploadedFileStatus.Processing,
					matchedStatus: UploadedFileMatchedStatus.InProgress,
					ocrResult: "",

					invoiceAnalyzedData: "",
					attachmentAnalyzedData: "",
					summaryAnalyzedData: "",

					invoices: [],
					attachments: [],
				};
			})
		);

		const savedFilesCount = await pdfService.saveFiles(uploadedFiles);

		res.json({ message: `${savedFilesCount} files uploaded` });
	}

	async getFiles(req: Request, res: Response) {
		const { limit = 10, page = 1 } = req.query;
		const response = await pdfService.getFiles(Number(limit), Number(page));

		res.json(response);
	}

	async deleteFile(req: Request, res: Response) {
		const { id } = req.params;
		const deletedFile = await pdfService.deleteFile(id);

		if (!deletedFile) {
			throw new Error(ERROR.FILE_NOT_FOUND);
		}

		await mistralAIService.deleteFile(deletedFile.id);

		res.json({ message: "File deleted" });
	}

	async getFileById(req: Request, res: Response) {
		const { id } = req.params;
		const fileWithConfig = await pdfService.getFileById(id);

		if (!fileWithConfig) {
			throw new Error(ERROR.FILE_NOT_FOUND);
		}

		res.json(fileWithConfig);
	}

	async regenerateFile(req: Request, res: Response) {
		const { id } = req.params;

		const updatedFile = await pdfService.updateFile(id, {
			uploadedStatus: UploadedFileStatus.Processing,
			matchedStatus: UploadedFileMatchedStatus.InProgress,
		});

		if (!updatedFile) {
			throw new Error(ERROR.FILE_NOT_FOUND);
		}

		const url = await mistralAIService.getUrl(id);
		pdfToImgService.pdfToImg(url, id);

		res.json(updatedFile);
	}

	async updateFile(req: Request, res: Response) {
		const { id } = req.params;

		const { data } = uploadedFileUpdateSchema.safeParse(req.body);

		const updatedFile = await pdfService.updateFile(id, data as IUploadedFileUpdate);

		if (!updatedFile) {
			throw new Error(ERROR.FILE_NOT_FOUND);
		}

		res.json(updatedFile);
	}
}

export const pdfController = new PdfController();
