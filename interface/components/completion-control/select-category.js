import {Select, SelectItem} from "@nextui-org/react";

const SelectCategory = ({categories, selectedPromptID, handleSelectionChange,isDisabled,selectedCategoryId}) => {

    return (
        <Select
            items={categories}
            label={"select a category"}
            selectedKeys={[""+selectedCategoryId]}
            onChange={handleSelectionChange}
            renderValue={(items) => {
                return items.map(item => {
                    return(<p key={item.key} className={"text-black"}>{item.data.name}</p>)
                })
            }}
            isDisabled={isDisabled} >
                {(c) => (
                    <SelectItem  key={c.ID} value={c.ID} clsssNames={{
                        base: "text-black",
                        selected: "text-black",
                        wrapper: "text-black"
                    }} textValue={c.name}>
                        <p className={"text-black"}>{c.name}</p>
                    </SelectItem>
                )}
        </Select>
    )
}

export default  SelectCategory;