<script setup lang="ts">
    import { useI18n } from "vue-i18n";
    import DiscussionsSideBar from "@/components/DiscussionsSideBar.vue";

    const { t } = useI18n();
</script>

<template>
    <DiscussionsSideBar></DiscussionsSideBar>
    <div>
        <p class="no-discussion-tip">{{ t("no-discussion-tip") }}</p>
    </div>
</template>

<style scoped>
    .no-discussion-tip {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        text-align: center;
        font-size: 18px;
        color: #666;
        padding: 0 20px;
    }
    .learning-path-title {
        white-space: normal;
    }
    .search-field-container {
        min-width: 250px;
    }
    .control-bar-above-content {
        margin-left: 5px;
        margin-right: 5px;
        margin-bottom: -30px;
        display: flex;
        justify-content: space-between;
    }
    .learning-object-view-container {
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
    }
    .navigation-buttons-container {
        padding: 20px;
        display: flex;
        justify-content: space-between;
    }
    .assignment-indicator {
        position: absolute;
        bottom: 10px;
        left: 10px;
        padding: 4px 12px;
        border: 2px solid #f8bcbc;
        border-radius: 20px;
        color: #f36c6c;
        background-color: rgba(248, 188, 188, 0.1);
        font-weight: bold;
        font-family: Arial, sans-serif;
        font-size: 14px;
        text-transform: uppercase;
        z-index: 2; /* Less than modals/popups */
    }
    .question-box {
        width: 100%;
        max-width: 400px;
        margin: 20px auto;
        font-family: sans-serif;
    }
    .input-wrapper {
        display: flex;
        align-items: center;
        border: 1px solid #ccc;
        border-radius: 999px;
        padding: 8px 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .question-input {
        flex: 1;
        border: none;
        outline: none;
        font-size: 14px;
        background-color: transparent;
    }

    .question-input::placeholder {
        color: #999;
    }

    .discussion-link {
        margin-top: 8px;
        font-size: 13px;
        color: #444;
    }

    .discussion-link a {
        color: #3b82f6; /* blue */
        text-decoration: none;
    }

    .discussion-link a:hover {
        text-decoration: underline;
    }
</style>
