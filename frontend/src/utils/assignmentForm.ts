
/**
 * Submits the form data to the backend.
 *
 * @param assignmentTitle - The title of the assignment.
 * @param selectedLearningPath - The selected learning path, containing hruid and title.
 * @param selectedClass - The selected classes, an array of class objects.
 * @param groups - An array of groups, each containing student IDs.
 * @param deadline - The deadline of the assignment in ISO format.
 * @param description - The description of the assignment
 * Sends a POST request to the backend with the form data.
 */

import {AssignmentController} from "@/controllers/assignments.ts";
import type {AssignmentDTO} from "@dwengo-1/common/interfaces/assignment";

export const submitForm = async (
    assignmentTitle: string,
    selectedLearningPath: any,
    selectedClass: string,
    groups: string[][],
    deadline: string,
    description: string,
    currentLanguage: string
) => {
    const formData: AssignmentDTO = {
        id: 0,
        class: selectedClass,
        title: assignmentTitle,
        description: description,
        learningPath: selectedLearningPath,
        language: currentLanguage,
        groups: [],
        //deadline: deadline,
    };

    console.log(formData);

    const controller: AssignmentController = new AssignmentController(selectedClass);

    const response = await controller.createAssignment(formData);
    console.log(response);

};

/**
 * Validation rule for the assignment title.
 *
 * Ensures that the title is not empty.
 */
export const assignmentTitleRules = [
    (value: string) => {
        if (value?.length >= 1) return true;  // Title must not be empty
        return 'Title cannot be empty.';
    },
];

/**
 * Validation rule for the learning path selection.
 *
 * Ensures that a valid learning path is selected.
 */
export const learningPathRules = [
    (value: { hruid: string; title: string }) => {
        if (value && value.hruid) {
            return true;  // Valid if hruid is present
        }
        return 'You must select a learning path.';
    },
];

/**
 * Validation rule for the classes selection.
 *
 * Ensures that at least one class is selected.
 */
export const classRules = [
    (value: string) => {
        if (value) return true;
        return 'You must select at least one class.';
    },
];

/**
 * Validation rule for the deadline field.
 *
 * Ensures that a valid deadline is selected and is in the future.
 */
export const deadlineRules = [
    (value: string) => {
        if (!value) return "You must set a deadline.";

        const selectedDateTime = new Date(value);
        const now = new Date();

        if (isNaN(selectedDateTime.getTime())) return "Invalid date or time.";

        if (selectedDateTime <= now) return "The deadline must be in the future.";

        return true;
    },
];

export const descriptionRules = [
    (value: string) => {
        if (!value || value.trim() === "") return "Description cannot be empty.";
        return true;
    },
];
