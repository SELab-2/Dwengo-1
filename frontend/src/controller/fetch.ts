export const fetchJson = async <T = any>(url: string, init?: RequestInit): Promise<T> => {
    const response = await fetch(url, init);

    if (!response.ok) {
        let errorMessage = `Error ${response.status} ${response.statusText}`;

        try {
            const errorData = await response.json();
            if (errorData?.error) {
                errorMessage = errorData.error;
            }
        } catch {
            // No valid JSON or error property
        }

        throw new Error(errorMessage);
    }

    return await response.json();
};
