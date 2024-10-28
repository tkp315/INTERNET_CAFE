"use client"
 interface Prop{
    text:string,
    color:string
 }
function ColorChanger({text,color}:Prop) {
  return (
    <div className={`text-${color}`}>
        {text}
    </div>
  )
}

export default ColorChanger
