export const THEMES_KEYS = [
    "kiks", "art", "socialrobot", "agriculture", "wegostem",
    "computational_thinking", "math_with_python", "python_programming",
    "stem", "care", "chatbot", "physical_computing", "algorithms", "basics_ai"
];

export const THEMESITEMS: Record<string, string[]> = {
    "all": THEMES_KEYS,
    "culture": ["art", "wegostem", "chatbot"],
    "electricity-and-mechanics": ["socialrobot", "wegostem", "stem", "physical_computing"],
    "nature-and-climate": ["kiks", "agriculture"],
    "agriculture": ["agriculture"],
    "society": ["kiks", "socialrobot", "care", "chatbot"],
    "math": ["kiks", "math_with_python", "python_programming", "stem", "care", "basics_ai"],
    "technology": ["socialrobot", "wegostem", "computational_thinking", "stem", "physical_computing", "basics_ai"],
    "algorithms": ["math_with_python", "python_programming", "stem", "algorithms", "basics_ai"],
};


export const AGEITEMS = [
    "all",
    "primary-school",
    "lower-secondary",
    "upper-secondary",
    "high-school",
    "older",
];
