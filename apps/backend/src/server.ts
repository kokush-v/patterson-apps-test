import express from "express";
import AppRouter from "./routes";
import { ENV_KEYS } from "./constants/env";
import cors from "cors";
import { corsConfig } from "./configurations/cors";
import { pdfService } from "./services/pdf.service";
import { createServer } from "node:http";
import { socketIO } from "./configurations/socket.io";
import path from "node:path";
import { pdfToImgService } from "./services/pdf-to-img.service";

const app = express();
const router = new AppRouter(app);

app.use(express.json());
app.use(cors(corsConfig));
app.use(express.static(path.join(__dirname, "public")));

app.set("port", ENV_KEYS.SERVER_PORT);

router.init();
const port = app.get("port");

const httpServer = createServer(app);

socketIO.initialize(httpServer);
socketIO.registerEvents();

httpServer.listen(port, () => {
	console.log(`Server running on port ${port}`);

	pdfService.pdfScanService();
	pdfService.pdfAnalyzeService();
});
