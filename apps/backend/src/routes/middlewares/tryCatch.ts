import { NextFunction, Request, Response } from "express";

export const tryCatch =
	(handler: (req: Request<any, any, any, any>, res: Response<any>, next: NextFunction) => Promise<void>) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await handler(req, res, next);
		} catch (error) {
			console.log(error);
			if (error instanceof Error) {
				let message = error.message;
				try {
					message = JSON.parse(error.message).message;
				} catch (e) {}
				res.status(500).json({ message });
			}
		}
	};
