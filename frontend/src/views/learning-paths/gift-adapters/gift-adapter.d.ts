interface GiftAdapter {
    questionType: string;
    installListener(
        questionElement: Element,
        answerUpdateCallback: (newAnswer: string | number | object) => void,
    ): void;
    setAnswer(questionElement: Element, answer: string | number | object): void;
}
