import {NewCategory} from "@/components/system_prompt_settings/category/new-category";

const CategoriesList = ({categories, setSelectedCategoryIdx, selectedCategoryIdx, handleNewCategory, creatingCategory, setCreatingCategory}) => {
    return (
        <ul className="flex flex-wrap w-1/2 gap-5">
            {categories?.map((category, index) => (
                <li key={index}
                    onClick={() => setSelectedCategoryIdx(index)}
                    className={`p-2 ${index === selectedCategoryIdx ? "bg-primary text-black" : "bg-gray-700 text-white"} rounded-md hover:bg-primary hover:text-black cursor-pointer duration-150 flex items-center justify-center`}>
                    {category.name}
                </li>
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