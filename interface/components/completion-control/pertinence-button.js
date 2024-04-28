export const PertinenceButton = ({onValueSelected, value, color, isEnabled}) =>{
    return (
        <button onClick={()=>{onValueSelected(value)}} className={`${color} rounded-lg w-[70px] h-[70px] text-white ${!isEnabled ? "grayscale" : "hover:scale-110"} duration-100`} disabled={!isEnabled}>
            {value}
        </button>
    )
}