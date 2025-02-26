import { Request, Response } from "express";
import axios from "axios";
import { themes } from "../data/themes.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Get API base URL from environment variables
const DWENGO_API_BASE = process.env.DWENGO_API_BASE as string;
if (!DWENGO_API_BASE) {
    throw new Error("DWENGO_API_BASE is not defined in the .env file");
}

/**
 * Fetch learning paths for a given list of HRUIDs.
 * This function sends a request to the Dwengo API with the provided HRUIDs.
 */
export async function getLearningPathsFromIds(req: Request, res: Response): Promise<void> {
    try {
        const { hruids } = req.query;
        const language = (req.query.language as string) || "nl"; // Default to Dutch

        if (!hruids) {
            res.status(400).json({ error: "Missing required parameter: hruids" });
            return;
        }

        // Convert the input to an array if it's a string
        const hruidList = Array.isArray(hruids) ? hruids : [hruids];

        // Request learning paths from Dwengo API
        const response = await axios.get(`${DWENGO_API_BASE}/learningPath/getPathsFromIdList`, {
            params: {
                pathIdList: JSON.stringify({ hruids: hruidList }),
                language
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching learning paths:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

/**
 * Fetch all learning paths for a specific theme.
 * First retrieves the HRUIDs associated with the theme,
 * then fetches the corresponding learning paths from the Dwengo API.
 */
export async function getLearningPathsByTheme(req: Request, res: Response): Promise<void> {
    try {
        const themeKey = req.params.theme;
        const language = (req.query.language as string) || "nl"; // Default to Dutch

        // Find the theme by its title
        const theme = themes.find((t) => t.title === themeKey);

        if (!theme) {
            res.status(404).json({ error: "Theme not found" });
            return;
        }

        // Extract HRUIDs from the theme
        const hruidList = theme.hruids;

        // Request learning paths from Dwengo API using the extracted HRUIDs
        const response = await axios.get(`${DWENGO_API_BASE}/learningPath/getPathsFromIdList`, {
            params: {
                pathIdList: JSON.stringify({ hruids: hruidList }),
                language
            }
        });

        res.json({
            theme: themeKey,
            hruids: hruidList,
            learningPaths: response.data
        });

    } catch (error) {
        console.error("Error fetching learning paths for theme:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function searchLearningPaths(req: Request, res: Response): Promise<void> {
    try {
        const query = req.query.query as string;
        const language = (req.query.language as string) || "nl";

        if (!query) {
            res.status(400).json({ error: "Missing search query" });
            return;
        }

        const response = await axios.get(`${DWENGO_API_BASE}/learningPath/search`, {
            params: { all: query, language }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error searching learning paths:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function getAllLearningPaths(req: Request, res: Response): Promise<void> {
    try {
        const language = (req.query.language as string) || "nl"; // Default to Dutch

        // Collect all HRUIDs from all themes
        const allHruids: string[] = themes.flatMap(theme => theme.hruids);

        if (allHruids.length === 0) {
            res.status(404).json({ error: "No HRUIDs found in themes" });
            return;
        }

        // Call the Dwengo API with all HRUIDs combined
        const response = await axios.get(`${DWENGO_API_BASE}/learningPath/getPathsFromIdList`, {
            params: {
                pathIdList: JSON.stringify({ hruids: allHruids }),
                language
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching all learning paths:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
