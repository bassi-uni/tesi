import {NewCategory} from "@/components/system_prompt_settings/category/new-category";
import Category from "@/components/system_prompt_settings/category/category";

const CategoriesList = ({categories, setSelectedCategoryIdx, selectedCategoryIdx, handleNewCategory, creatingCategory, setCreatingCategory}) => {
    return (
        <ul className="flex w-2/3 gap-5">
            {categories?.map((category, index) => (
                    <Category key={index} name={category.name} onClick={() => setSelectedCategoryIdx(index)} isSelected={index === selectedCategoryIdx}/>
            ))}
            {creatingCategory && <NewCategory onNewCategory={handleNewCategory} />}
            <li
                key={categories?.length}
                onClick={() => setCreatingCategory(true)}
                className="text-white p-2 rounded-md hover:bg-primary hover:text-black cursor-pointer duration-150 flex items-center justify-center">
                +
            </li>
        </ul>
    )
}
export default CategoriesList