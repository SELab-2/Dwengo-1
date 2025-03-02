import { createI18n } from "vue-i18n";

// Import translations
import en from "@/i18n/locales/en.json";
import nl from "@/i18n/locales/nl.json";
import fr from "@/i18n/locales/fr.json";
import de from "@/i18n/locales/de.json";

const i18n = createI18n({
    //legacy: false,
    locale: "en",
    fallbackLocale: "en",
    messages: {
        en: { ...en },
        nl: { ...nl },
        fr: { ...fr },
        de: { ...de },
    },
});

export default i18n;
