import classes from "./new-category.module.css";
import {Button, ButtonGroup, Tooltip} from "@nextui-org/react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const Category = ({onClick, isSelected, name}) => {
    return (
        <Tooltip content={
            <ButtonGroup>
                <Button endContent={<MdDelete />} color={"danger"}>Delete</Button>
                <Button endContent={<FaEdit />} color={"success"}>Edit</Button>
            </ButtonGroup>
        }
        classNames={{
            content: "bg-transparent unset shadow-none",
        }}
        >
            <li
                onClick={onClick}
                className={`${classes.container} p-2 ${isSelected ? "bg-primary text-black" : "bg-gray-700 text-white"} rounded-md hover:bg-primary hover:text-black cursor-pointer duration-150 flex items-center justify-center`}>
                {name}

            </li>
        </Tooltip>

    )
}

export default Category;