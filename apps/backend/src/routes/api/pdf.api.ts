import { Router } from "express";
import fileUpload from "../../configurations/multer";
import { tryCatch } from "../middlewares/tryCatch";
import { pdfController } from "../../controllers/pdf.controller";

const pdfRouter = Router();

pdfRouter.post("/uploadFiles", fileUpload.array("files"), tryCatch(pdfController.uploadFiles));
pdfRouter.get("/getFiles", tryCatch(pdfController.getFiles));
pdfRouter.delete("/deleteFile/:id", tryCatch(pdfController.deleteFile));
pdfRouter.put("/regenerateFile/:id", tryCatch(pdfController.regenerateFile));
pdfRouter.get("/getFile/:id", tryCatch(pdfController.getFileById));
pdfRouter.put("/updateFile/:id", tryCatch(pdfController.updateFile));

export default pdfRouter;
