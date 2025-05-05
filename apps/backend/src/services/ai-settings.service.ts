import { AiSettings } from "@prisma/client";
import { IAiSettings } from "../types/ai-settings";
import { prisma } from "./prisma.service";

class AiSettingsService {
	private readonly aiSettingsRepository = prisma.aiSettings;

	async getAiSetting(): Promise<AiSettings> {
		return await this.aiSettingsRepository.findFirstOrThrow();
	}

	async updateAiSetting({ id, ...data }: IAiSettings): Promise<AiSettings> {
		return await this.aiSettingsRepository.update({
			where: {
				id: id,
			},
			data,
		});
	}
}

export const aiSettingsService = new AiSettingsService();
