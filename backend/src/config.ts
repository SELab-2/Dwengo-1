// Can be placed in dotenv but found it redundant

// Import dotenv from "dotenv";

// Load .env file
// Dotenv.config();

import {Language} from "./entities/content/language.js";

export const DWENGO_API_BASE = 'https://dwengo.org/backend/api';

export const FALLBACK_LANG: Language = Language.Dutch;

export const FALLBACK_SEQ_NUM = 1;
