import {Select, SelectItem} from "@nextui-org/react";

const SelectCategory = ({categories, selectedCategory, handleSelectionChange}) => {
    return (
        <Select items={categories} label={"select a category"} selectedKeys={[selectedCategory]} onChange={handleSelectionChange} renderValue={([item]) => {
            return item?.data.name
        }} >
            {(c) => (<SelectItem  key={c.promptID} value={c.name} clsssNames={{
                base: "text-black",
                selected: "text-black",
                wrapper: "text-black"
            }} ><p className={"text-black"}>{c.name}</p></SelectItem>)}

        </Select>
    )
}

export default  SelectCategory;