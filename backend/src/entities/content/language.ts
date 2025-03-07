/**
 * @swagger
 * components:
 *   schemas:
 *     Language:
 *       type: string
 *       enum:
 *         - nl
 *         - fr
 *         - en
 *         - de
 *   parameters:
 *     Language:
 *       in: query
 *       name: language
 *       description: Language of the content
 *       required: false
 *       schema:
 *         $ref: '#/components/schemas/Language'
 */
export enum Language {
    Dutch = 'nl',
    French = 'fr',
    English = 'en',
    Germany = 'de',
}
