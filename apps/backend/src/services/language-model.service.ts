import OpenAI from "openai";
import { ENV_KEYS } from "../constants/env";

class LanguageModelService {
	readonly model;

	constructor() {
		this.model = new OpenAI({ apiKey: ENV_KEYS.OPENAI_API_KEY });
	}

	async useChat(promt: string): Promise<string> {
		const { output_text } = await this.model.responses.create({
			model: ENV_KEYS.OPENAI_MODEL,
			input: promt,
		});

		return output_text;
	}
}

export const languageModelService = new LanguageModelService();
