import { Router } from "express";
import { tryCatch } from "../middlewares/tryCatch";
import { aiSettingsController } from "../../controllers/ai-settings.controller";

const aiSettingsRouter = Router();

aiSettingsRouter.post("/updateSetting", tryCatch(aiSettingsController.updateAiSetting));
aiSettingsRouter.get("/getSetting", tryCatch(aiSettingsController.getAiSetting));

export default aiSettingsRouter;
