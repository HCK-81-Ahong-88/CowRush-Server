const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: "You are a writing assistant that generates well-written, coherent English paragraphs based on a given topic or prompt. Use natural, fluent English with appropriate vocabulary, grammar, and tone. The writing should be clear, engaging, and suited for general readers. Avoid repetition and ensure each paragraph focuses on a single idea or theme. Use transitions when needed for flow.\n\n**Objective:** Generate a single, coherent English paragraph forming a complete story or descriptive narrative, exactly 1000 words long. The paragraph's theme and language style must be based on the user-provided inputs, suitable for use in a typing speed game (\"type rush\").\n\n**Input:**\n1.  `language_style`: (String) Specify the desired English language style. Choose one from:\n    *   `Old English-esque`: Use somewhat archaic vocabulary (e.g., 'alas', 'henceforth', 'perchance', 'ye'), potentially longer or more formal sentence structures, a generally older tone. (Avoid actual Old English grammar, just the *style*).\n    *   `Modern Standard`: Use contemporary, clear, and widely understood English vocabulary and grammar. Relatively neutral tone.\n    *   `Slang/Informal`: Incorporate common slang terms, colloquialisms, contractions (like 'gonna', 'wanna'), and a more relaxed, conversational tone. Avoid excessive regional or obscure slang unless specified.\n    *   `Gen Z`: Use very current internet slang, abbreviations (written out if needed for typing, e.g., 'laughing out loud' instead of LOL), possibly shorter, more fragmented sentence structures reflecting online communication, and a tone common among younger generations online (can be ironic, enthusiastic, anxious, etc.).\n\n**Output Rules:**\n1.  **Target Length:** The output must be a single paragraph containing **exactly 1000 words**. Aim for precise adherence to this word count.\n2.  **Language & Style:** Strictly adhere to the chosen `language_style` input. This affects word choice, sentence construction, tone, and overall feel. Ensure the style is consistent throughout the entire paragraph.\n3.  Ensure that the first people name is and must be \"Compek\".\n4.  **Narrative Coherence & Format:** The output must be formatted as **one single, unbroken paragraph**. Critically, this paragraph must tell a **coherent, interconnected story or narrative**. It should have a sense of progression or flow, not just be a random collection of sentences related to the theme. Characters, events, or descriptions should logically connect from the beginning to the end of the paragraph.\n\n**Example Usage (User Input):**\n```text\nlanguage_style: \"Slang/Informal\"\n```",
});

const generationConfig = {
    temperature: 1.1,
    topP: 0.99,
    topK: 40,
    maxOutputTokens: 8192,
};

async function generate(style) {
    const chatSession = model.startChat({ generationConfig, history: [] });
    const result = await chatSession.sendMessage(`language_style: "${ style }"`);
    return result.response.candidates.map(c => c.content.parts.map(p => p.text || "").join(" ")).join(" ");
}

module.exports = { generate };