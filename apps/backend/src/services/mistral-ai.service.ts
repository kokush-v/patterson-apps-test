import { Mistral } from "@mistralai/mistralai";
import { OCRResponse, UploadFileOut } from "@mistralai/mistralai/models/components";
import { ENV_KEYS } from "../constants/env";
import { ERROR } from "../constants/errors";
import { pdfToImgService } from "./pdf-to-img.service";

class MistralAIService {
	readonly client: Mistral;

	constructor() {
		this.client = new Mistral({
			apiKey: ENV_KEYS.MISTRAL_AI_API_KEY,
		});
	}

	async uploadFile(file: Express.Multer.File): Promise<UploadFileOut> {
		const uploadedFile = await this.client.files.upload({
			file: {
				fileName: file.originalname,
				content: file.buffer,
			},
			// @ts-ignore
			purpose: "ocr",
		});

		const url = await this.getUrl(uploadedFile.id);

		await pdfToImgService.pdfToImg(url, uploadedFile.id);

		return uploadedFile;
	}

	async getOcrFromPdf(fileId: string): Promise<OCRResponse> {
		const url = await this.getUrl(fileId);

		const result = await this.client.ocr.process({
			model: "mistral-ocr-latest",
			document: {
				type: "document_url",
				documentUrl: url,
			},
		});

		return result;
	}

	async getUrl(fileId: string): Promise<string> {
		const { url } = await this.client.files.getSignedUrl({
			fileId,
		});
		return url;
	}

	async deleteFile(fileId: string): Promise<void> {
		await this.client.files.delete({
			fileId,
		});
	}
}

export const mistralAIService = new MistralAIService();
