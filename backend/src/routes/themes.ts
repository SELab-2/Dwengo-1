import express, { Request, Response } from "express";
import fs from "fs";
import yaml from "js-yaml";
import path from "path";

const router = express.Router();

const themes = [
    {
        title: "kiks",
        hruids: [
            "pn_werking", "un_artificiele_intelligentie", "pn_klimaatverandering",
            "kiks1_microscopie", "kiks2_practicum", "pn_digitalebeelden",
            "kiks3_dl_basis", "kiks4_dl_gevorderd", "kiks5_classificatie",
            "kiks6_regressie", "kiks7_ethiek", "kiks8_eindtermen"
        ]
    },
    {
        title: "art",
        hruids: [
            "pn_werking", "un_artificiele_intelligentie", "art1", "art2", "art3"
        ]
    },
    {
        title: "socialrobot",
        hruids: [
            "sr0_lkr", "sr0_lln", "sr1", "sr2", "sr3", "sr4"
        ]
    },
    {
        title: "agriculture",
        hruids: [
            "pn_werking", "un_artificiele_intelligentie", "agri_landbouw", "agri_lopendeband"
        ]
    },
    {
        title: "wegostem",
        hruids: [
            "wegostem"
        ]
    },
    {
        title: "computational_thinking",
        hruids: [
            "ct1_concepten", "ct2_concreet", "ct3_voorbeelden", "ct6_cases",
            "ct9_impact", "ct10_bebras", "ct8_eindtermen", "ct7_historiek",
            "ct5_kijkwijzer", "ct4_evaluatiekader"
        ]
    },
    {
        title: "math_with_python",
        hruids: [
            "pn_werking", "maths_pythagoras", "maths_spreidingsdiagrammen",
            "maths_rechten", "maths_lineaireregressie", "maths_epidemie",
            "pn_digitalebeelden", "maths_logica", "maths_parameters",
            "maths_parabolen", "pn_regressie", "maths7_grafen", "maths8_statistiek"
        ]
    },
    {
        title: "python_programming",
        hruids: [
            "pn_werking", "pn_datatypes", "pn_operatoren", "pn_structuren",
            "pn_functies", "art2", "stem_insectbooks", "un_algoenprog"
        ]
    },
    {
        title: "stem",
        hruids: [
            "pn_werking", "maths_spreidingsdiagrammen", "pn_digitalebeelden",
            "maths_epidemie", "stem_ipadres", "pn_klimaatverandering",
            "stem_rechten", "stem_lineaireregressie", "stem_insectbooks"
        ]
    },
    {
        title: "care",
        hruids: [
            "pn_werking", "un_artificiele_intelligentie", "aiz1_zorg", "aiz2_grafen",
            "aiz3_unplugged", "aiz4_eindtermen", "aiz5_triage"
        ]
    },
    {
        title: "chatbot",
        hruids: [
            "pn_werking", "un_artificiele_intelligentie", "cb5_chatbotunplugged",
            "cb1_chatbot", "cb2_sentimentanalyse", "cb3_vervoegmachine",
            "cb4_eindtermen", "cb6"
        ]
    },
    {
        title: "physical_computing",
        hruids: [
            "pc_starttodwenguino", "pc_rijdenderobot", "pc_theremin",
            "pc_leerlijn_introductie", "pc_leerlijn_invoer_verwerking_uitvoer",
            "pc_leerlijn_basisprincipes_digitale_elektronica",
            "pc_leerlijn_grafisch_naar_tekstueel", "pc_leerlijn_basis_programmeren",
            "pc_leerlijn_van_µc_naar_plc", "pc_leerlijn_fiches_dwenguino",
            "pc_leerlijn_seriele_monitor", "pc_leerlijn_bus_protocollen",
            "pc_leerlijn_wifi", "pc_leerlijn_fiches_arduino",
            "pc_leerlijn_project_lijnvolger", "pc_leerlijn_project_bluetooth",
            "pc_leerlijn_hddclock", "pc_leerlijn_fysica_valbeweging",
            "pc_leerlijn_luchtkwaliteit", "pc_leerlijn_weerstation",
            "pc_leerlijn_g0", "pc_leerlijn_g1", "pc_leerlijn_g3", "pc_leerlijn_g4",
            "pc_leerlijn_g5"
        ]
    },
    {
        title: "algorithms",
        hruids: [
            "art2", "anm1", "anm2", "anm3", "anm4", "anm11", "anm12", "anm13",
            "anm14", "anm15", "anm16", "anm17", "maths_epidemie", "stem_insectbooks"
        ]
    },
    {
        title: "basics_ai",
        hruids: [
            "un_artificiele_intelligentie", "org-dwengo-waisda-taal-murder-mistery",
            "art1", "org-dwengo-waisda-beelden-emoties-herkennen",
            "org-dwengo-waisda-beelden-unplugged-fax-lp",
            "org-dwengo-waisda-beelden-teachable-machine"
        ]
    }
];



// Define interfaces for type safety
interface Theme {
    title: string;
    hruids: string[];
}

interface Translations {
    curricula_page: {
        [key: string]: { title: string };
    };
}

// Function to load translations from YAML files
const loadTranslations = (language: string): Translations => {
    try {
        const filePath = path.join(process.cwd(), "_i18n", `${language}.yml`);
        const yamlFile = fs.readFileSync(filePath, "utf8");
        return yaml.load(yamlFile) as Translations;
    } catch (error) {
        console.error(`Kan vertaling niet laden voor ${language}, fallback naar Nederlands`);
        const fallbackPath = path.join(process.cwd(), "_i18n", "nl.yml");
        return yaml.load(fs.readFileSync(fallbackPath, "utf8")) as Translations;
    }
};

// **GET /themes** → Returns a list of all themes as { theme: "key", translation: "Title in requested language" }
router.get("/themes", (req: Request, res: Response) => {
    const language = (req.query.language as string)?.toLowerCase() || "nl"; // Default: Nederlands
    const translations = loadTranslations(language);

    const themeList = (themes as Theme[]).map((theme) => ({
        key: theme.title,  // The original key
        theme: translations.curricula_page[theme.title]?.title || theme.title
    }));
    res.json(themeList);
});

// **GET /themes/:theme** → Returns hruids for a theme
router.get("/themes/:theme", (req: Request, res: Response) => {
    const themeKey = req.params.theme; // This is the `title` in themes_hruids.json

    // Find the theme in the JSON list
    const theme = (themes as Theme[]).find((t) => t.title === themeKey);

    if (theme) {
        res.json(theme.hruids);
    } else {
        res.status(404).json({ error: "Thema niet gevonden" });
    }
});

export default router;
