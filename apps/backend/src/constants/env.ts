import dotenv from "dotenv";
dotenv.config();

export const ENV_KEYS = {
	SERVER_PORT: process.env.SERVER_PORT || 3001,
	CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3001",

	MISTRAL_AI_API_KEY: process.env.MISTRAL_AI_API_KEY || "",
	MISTRAL_AI_PROMPT: process.env.MISTRAL_AI_PROMPT || "",

	OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
	OPENAI_MODEL: process.env.OPENAI_MODEL || "",
};
