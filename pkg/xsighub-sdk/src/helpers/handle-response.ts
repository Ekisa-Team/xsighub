export const handleResponse = async (response: Response) => {
    const contentType = response.headers.get('content-type');

    if (!response.ok) {
        throw new Error(await response.text());
    }

    const isJsonResponse = contentType && contentType.includes('application/json');

    return isJsonResponse ? response.json() : response.text();
};
