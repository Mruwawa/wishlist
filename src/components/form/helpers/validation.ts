export function validateURL(value: string): { valid: boolean, error?: string } {
    const regex = /^https?:\/\/(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+(?:\/[^\s]*)?$/;

    if (!regex.test(value)) {
        return {
            valid: false,
            error: "This is not a valid URL",
        };
    }
    return { valid: true };
}