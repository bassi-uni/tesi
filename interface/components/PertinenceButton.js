export const PertinenceButton = ({onValueSelected, value, color, isEnabled}) =>{
    return (
        <button onClick={()=>{onValueSelected(value)}} className={`${color} rounded-md w-[50px] h-[50px] text-white ${!isEnabled ? "grayscale" : "hover:scale-110"} duration-100`} disabled={!isEnabled}>
            {value}
        </button>
    )
}