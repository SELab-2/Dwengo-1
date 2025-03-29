/**
 * Submits the form data to the backend.
 *
 * @param assignmentTitle - The title of the assignment.
 * @param selectedLearningPath - The selected learning path, containing hruid and title.
 * @param selectedClasses - The selected classes, an array of class objects.
 * @param groups - An array of groups, each containing student IDs.
 *
 * Sends a POST request to the backend with the form data.
 */
export const submitForm = async (
    assignmentTitle: string,
    selectedLearningPath: any,
    selectedClasses: any[],
    groups: string[][]
) => {
    const formData = {
        title: assignmentTitle,
        hruid: selectedLearningPath?.hruid,
        classes: selectedClasses.map(cl => cl.value),
        groups: groups
    };

    try {
        const response = await fetch(/*"http://localhost:3000/api/assignment"*/"", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        console.log("Form submitted successfully:", data);
    } catch (error) {
        console.error("Error submitting form:", error);
    }
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
export const classesRules = [
    (value: any[]) => {
        if (value?.length >= 1) return true;
        return 'You must select at least one class.';
    },
];
