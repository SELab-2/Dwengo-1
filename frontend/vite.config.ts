import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
            "@dwengo-1/common": fileURLToPath(new URL("../common/src", import.meta.url)),
        },
    },
    build: {
        target: "esnext", //Browsers can handle the latest ES features
    },
});
