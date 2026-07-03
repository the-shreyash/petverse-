import FloatingBlur from "../FloatingBlur"

const Aurora = ()=>{
    return(
        <>
        <FloatingBlur size ={450}
        color = "bg-emerald-300"
        top ="-120px"
        left="-120px"
        />
        

        <FloatingBlur size={550}
        color="bg-cyan-300"
        top = "150px"
        right ="-18px"
        />

        <FloatingBlur
        size={350}
        color="bg-teal-200"
        bottom="-100px"
        left="35%"
      />
    </>
    )
}

export default Aurora