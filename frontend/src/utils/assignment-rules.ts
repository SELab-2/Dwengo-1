import {useI18n} from "vue-i18n";

const { t } = useI18n();

/**
 * Validation rule for the assignment title.
 *
 * Ensures that the title is not empty.
 */
export const assignmentTitleRules = [
    (value: string): string | boolean => {
        if (value?.length >= 1) {
            return true;
        } // Title must not be empty
        return t("title-required");
    },
];


/**
 * Validation rule for the classes selection.
 *
 * Ensures that at least one class is selected.
 */
export const classRules = [
    (value: string): string | boolean => {
        if (value) {
            return true;
        }
        return t("class-required");
    },
];

/**
 * Validation rule for the deadline field.
 *
 * Ensures that a valid deadline is selected and is in the future.
 */
export const deadlineRules = [
    (value: string): string | boolean => {

        const selectedDateTime = new Date(value);
        const now = new Date();

        if (isNaN(selectedDateTime.getTime())) {
            return t("deadline-invalid");
        }

        if (selectedDateTime <= now) {
            return t("deadline-past");
        }

        return true;
    },
];
