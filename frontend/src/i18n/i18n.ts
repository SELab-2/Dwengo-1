import { createI18n } from "vue-i18n";

// Import translations
import en from "@/i18n/locale/en.json";
import nl from "@/i18n/locale/nl.json";
import fr from "@/i18n/locale/fr.json";
import de from "@/i18n/locale/de.json";

const savedLocale = localStorage.getItem("user-lang") || "en";

const i18n = createI18n({
    locale: savedLocale,
    fallbackLocale: "en",
    messages: {
        en: en,
        nl: nl,
        fr: fr,
        de: de,
    },
});

export default i18n;
