export const essayQuestionAdapter: GiftAdapter = {
    questionType: "Essay",

    installListener(
        questionElement: Element,
        answerUpdateCallback: (newAnswer: string | number | object) => void,
    ): void {
        const textArea = questionElement.querySelector("textarea")!;
        textArea.addEventListener("input", () => {
            answerUpdateCallback(textArea.value);
        });
    },

    setAnswer(questionElement: Element, answer: string | number | object): void {
        const textArea = questionElement.querySelector("textarea")!;
        textArea.value = String(answer);
    },
};
