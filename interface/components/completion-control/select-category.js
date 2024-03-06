import {Select, SelectItem} from "@nextui-org/react";

const SelectCategory = ({categories, selectedPromptID, handleSelectionChange,isDisabled}) => {
    console.log({selectedPromptID})
    return (
        <Select
            items={categories}
            label={"select a category"}
            selectedKeys={[selectedPromptID]}
            onChange={handleSelectionChange}
            renderValue={([item]) => {
                return item?.data.name
            }}
            isDisabled={isDisabled} >
                {(c) => (
                    <SelectItem  key={c.promptID} value={c.name} clsssNames={{
                        base: "text-black",
                        selected: "text-black",
                        wrapper: "text-black"
                    }} >
                        <p className={"text-black"}>{c.name}</p>
                    </SelectItem>
                )}
        </Select>
    )
}

export default  SelectCategory;