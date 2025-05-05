import { Application } from "express";
import pdfRouter from "./api/pdf.api";
import aiSettingsRouter from "./api/ai-settings";
import path from "node:path";
import { pdfToImgService } from "../services/pdf-to-img.service";

class AppRouter {
	constructor(private app: Application) {}

	init() {
		this.app.use("/pdf", pdfRouter);
		this.app.use("/ai-settings", aiSettingsRouter);

		// Serve PDF
		this.app.get("/pdf/:fileId/:fileName", (req, res) => {
			const { fileId, fileName } = req.params;

			const filePath = path.join(pdfToImgService.baseDir, fileId, fileName);
			res.sendFile(filePath);
		});

		// Serve static files
		this.app.get("*", (req, res) => {
			res.sendFile(path.join(__dirname, "../../dist", "public", "index.html"));
		});
	}
}

export default AppRouter;
