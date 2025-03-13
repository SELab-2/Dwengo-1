/**
 * Converts a Base64 string to a valid image source URL.
 *
 * @param base64String - The "image" field from the learning path JSON response.
 * @returns A properly formatted data URL for use in an <img> tag.
 *
 * @example
 * // Fetch the learning path data and extract the image
 * const response = await fetch( learning path route );
 * const data = await response.json();
 * const base64String = data.image;
 *
 * // Use in an <img> element
 * <img :src="convertBase64ToImageSrc(base64String)" alt="Learning Path Image" />
 */
export function convertBase64ToImageSrc(base64String: string): string {
    return base64String.startsWith("data:image") ? base64String : `data:image/png;base64,${base64String}`;
}
