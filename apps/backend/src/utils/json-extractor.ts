export function extractJsonFromString(input: string): any | null {
	const match = input.match(/```json\s*([\s\S]*?)```/);

	try {
		if (!match || !match[1]) {
			return JSON.parse(input);
		}

		return JSON.parse(match[1]);
	} catch (error) {
		console.error("Failed to parse JSON:", error);
		return null;
	}
}
