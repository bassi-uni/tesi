 import ChooseItem from "@/components/choose-answer/choose-item";

const ChoicesList = ({promptIDs, handleChoseClick, question, withTranslation, selectedModel, overAllLoading, getIsLoading, completions,getSetCompletion, chosenPromptID}) => {
    return <div className={"h-[500px] flex flex-row justify-start w-full gap-3 self-start"}>
        {promptIDs.map((p,idx) => (
            <ChooseItem
                key={idx}
                question={question}
                prompt={p}
                withTranslation={withTranslation}
                selectedModel={selectedModel}
                onChoseClick={handleChoseClick}
                loading={overAllLoading[idx]}
                setIsLoading={getIsLoading(idx)}
                completion={completions[idx]}
                setCompletion={getSetCompletion(idx)}
                isSelected={chosenPromptID === p.promptID}
            />
        ))}
    </div>
}

export default ChoicesList;