import {Select, SelectItem} from "@nextui-org/react";

const SelectModel = ({models, selectedModel, setSelectedModel}) => {
    return (
        <Select items={models} label={"select a model"} selectedKeys={[selectedModel]} onChange={e=>{
            setSelectedModel(e.target.value);
        }} renderValue={([item]) => {
            return item?.data.key
        }} >
            {(m) => (<SelectItem  key={m.key} value={m.key} clsssNames={{
                base: "text-black",
                selected: "text-black",
                wrapper: "text-black"
            }} ><p className={"text-black"}>{m.key}</p></SelectItem>)}

        </Select>
    )
}

export default SelectModel;