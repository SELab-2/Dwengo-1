export const multipleChoiceQuestionAdapter: GiftAdapter = {
    questionType: "MC",

    installListener(questionElement: Element, answerUpdateCallback: (newAnswer: string | number | object) => void): void {
        questionElement.querySelectorAll('input[type=radio]').forEach(element => {
            const input = element as HTMLInputElement;

            input.addEventListener('change', () => {
                answerUpdateCallback(parseInt(input.value));
            });
            // Optional: initialize value if already selected
            if (input.checked) {
                answerUpdateCallback(parseInt(input.value));
            }
        });
    },

    setAnswer(questionElement: Element, answer: string | number | object): void {
        questionElement.querySelectorAll('input[type=radio]').forEach(element => {
            const input = element as HTMLInputElement;
            input.checked = String(answer) === String(input.value);
        });
    }
}
