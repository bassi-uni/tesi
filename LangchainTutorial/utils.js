

import {PromptTemplate, ChatPromptTemplate, FewShotChatMessagePromptTemplate} from "@langchain/core/prompts";
import {BytesOutputParser, StringOutputParser} from "@langchain/core/output_parsers";
import {getCurrentSystemPrompt} from "@/utils/dbutils";
import {RunnableSequence, RunnablePassthrough} from "@langchain/core/runnables";
import {StructuredOutputParser} from "langchain/output_parsers";



export function initRetranslationChain(model) {
    const outputParser = new BytesOutputParser();

    const retranslationPrompt = ChatPromptTemplate.fromMessages([
        ["system", "Given a sentence by User, translate that sentence into {language}, do not add any other extra information or characters"],
        ["user", "Translate this sentence into English:\n'Ciao, come stai?'"],
        ["ai", "Hello, how are you?"],
        ["user", "Translate this sentence into Italian:\n'Je suis un homme'"],
        ["ai", "Sono un uomo"],
        ["user", "Translate this sentence into {language}:\n'{input}'"],
    ])

    return RunnableSequence.from([
        retranslationPrompt,
        model,
        new StringOutputParser(),
    ])
}

export function initTranslationChain(model) {
    const parser = StructuredOutputParser.fromNamesAndDescriptions({
        recognized_language: "input's language that you have recognized",
        translation: "the translation of the user input into the target language",
    });
    const formatInstructions = parser.getFormatInstructions();

    const translationSystemPrompt = `Given a sentence by User, translate that sentence into {language}, you have also to recognize the language which is used for writing the input\n{format_instructions}\nUser: {input}\nAI: `;
    const translationTemplate = TEMPLATE_FN(translationSystemPrompt);
    const translationPrompt = PromptTemplate.fromTemplate(translationSystemPrompt);


    const translationChain = RunnableSequence.from([
        translationPrompt,
        model,
        parser,
    ])

    return {translationChain,formatInstructions};
}

export function initResponseChain(category, model) {
    const system_prompt = getCurrentSystemPrompt({promptID: category});


    const template = TEMPLATE_FN(system_prompt);


    const PROMPT = ChatPromptTemplate.fromTemplate(template);

    return  RunnableSequence.from([
        PROMPT,
        model,
        new StringOutputParser(),

    ])
}
