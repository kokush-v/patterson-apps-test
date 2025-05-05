import axios from "axios";
import fs from "fs";
import path from "path";
import { fromPath } from "pdf2pic";
import { WriteImageResponse } from "pdf2pic/dist/types/convertResponse";
import { pdfService } from "./pdf.service";

class PdfToImgService {
	readonly baseDir: string = path.join(__dirname, "../../../../public", "pdf");

	constructor() {
		if (this.baseDir) {
			fs.mkdirSync(this.baseDir, { recursive: true });
		}
	}

	async pdfToImg(pdfUrl: string, pdfId: string): Promise<string[]> {
		const pdfFolderPath = path.join(this.baseDir, pdfId);
		const tempPdfPath = path.join(pdfFolderPath, `${pdfId}.pdf`);
		const savedImages: string[] = [];

		if (!fs.existsSync(pdfFolderPath)) {
			fs.mkdirSync(pdfFolderPath, { recursive: true });
		}

		const response = await axios.get<ArrayBuffer>(pdfUrl, { responseType: "arraybuffer" });
		fs.writeFileSync(tempPdfPath, Buffer.from(response.data));
		console.log(`PDF downloaded to ${tempPdfPath}`);

		const convert = fromPath(tempPdfPath, {
			density: 100,
			format: "png",
			savePath: pdfFolderPath,
			saveFilename: "page",
			width: 500,
			height: 800,
		}).bulk;

		const result = (await convert(-1)) as WriteImageResponse[];

		result.forEach(({ path }) => {
			if (path) {
				const relative = `/pdf/${pdfId}/${path.split("/").pop()}`;
				savedImages.push(relative);
			}
		});

		console.log(`Converted ${savedImages.length} page(s).`);

		return savedImages;
	}
}

export const pdfToImgService = new PdfToImgService();
