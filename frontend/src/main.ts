import { createApp } from "vue";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import i18n from "./i18n/i18n.ts";

// JSON-editor
import JsonEditorVue from 'json-editor-vue';

// Components
import App from "./App.vue";
import router from "./router";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";
import { de, en, fr, nl } from "vuetify/locale";

const app = createApp(App);

app.use(router);
app.use(JsonEditorVue, {})

const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css";
document.head.appendChild(link);

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: "mdi",
        aliases,
        sets: {
            mdi,
        },
    },
    locale: {
        locale: i18n.global.locale,
        fallback: 'en',
        messages: { nl, en, de, fr }
    }
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

app.use(vuetify);
app.use(i18n);
app.use(VueQueryPlugin, { queryClient });

app.mount("#app");
