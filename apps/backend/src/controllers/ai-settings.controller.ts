import { Request, Response } from "express";
import { aiSettingsService } from "../services/ai-settings.service";
import { aiSettingsSchema } from "../types/ai-settings";

class AiSettingsController {
	async getAiSetting(req: Request, res: Response) {
		const response = await aiSettingsService.getAiSetting();
		res.json(response);
	}

	async updateAiSetting(req: Request, res: Response) {
		const data = req.body;

		const { data: parsedData, error } = aiSettingsSchema.safeParse(data);

		if (error) {
			throw new Error(error.message);
		}

		const response = await aiSettingsService.updateAiSetting(parsedData);
		res.json(response);
	}
}

export const aiSettingsController = new AiSettingsController();
