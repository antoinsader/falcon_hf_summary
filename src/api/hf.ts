import { requestUrl, RequestUrlResponse } from "obsidian";

interface ValidationResult {
	isValid: boolean;
	name: string | null; // The username
	fullname?: string | null;
	email?: string | null;
	auth: {
		accessToken: {
			displayName: string;
			role: "read" | "write" | "admin";
		};
	} | null;
}

export async function validate_token(token: string): Promise<ValidationResult> {
	if (!token || token.trim() === "") return createInvalidResult();

	try {
		const response: RequestUrlResponse = await requestUrl({
			url: "https://huggingface.co/api/whoami-v2",
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response.status === 200) {
			const data: ValidationResult = response.json;

			return {
				isValid: true,
				name: data.name,
				fullname: data.fullname || null,
				email: data.email || null,
				auth: {
					accessToken: {
						displayName:
							data.auth?.accessToken?.displayName || "default",
						role: data.auth?.accessToken?.role || "read",
					},
				},
			};
		}
		return createInvalidResult();
	} catch (err) {
		console.error(
			"Token validation failed due to network or API error:",
			err
		);
		return createInvalidResult();
	}
}
function createInvalidResult(): ValidationResult {
	return {
		isValid: false,
		name: null,
		fullname: null,
		email: null,
		auth: null,
	};
}
