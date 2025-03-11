/**
 * Based on https://github.com/dwengovzw/Learning-Object-Repository/blob/main/app/processors/content_type.js
 */

enum DwengoContentType {
    TEXT_PLAIN = 'text/plain',
    TEXT_MARKDOWN = 'text/markdown',
    IMAGE_BLOCK = 'image/image-block',
    IMAGE_INLINE = 'image/image',
    AUDIO_MPEG = 'audio/mpeg',
    APPLICATION_PDF = 'application/pdf',
    EXTERN = 'extern',
    BLOCKLY = 'blockly',
    GIFT = 'text/gift',
    CT_SCHEMA = 'text/ct-schema',
}

export { DwengoContentType };
