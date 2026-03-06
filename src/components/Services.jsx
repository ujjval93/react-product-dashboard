import React, { useEffect, useState } from 'react'

const Services = () => {
    const [first, setFirst] = useState("this is normal data");
    const [second, setSecond] = useState("this is large data");
    useEffect(()=>{
        console.log("Service component is created!");

        return()=>{
            console.log("Service component is deleted!");
        };
    }, []);
  return (
    <div>
        <h1>{first}</h1>
        <button onClick={()=> setFirst("Normal data has been changed")}
        className='px-3 py-2 rounded-md bg-red-400 text-white mt-2 mb-2'> Change normal data</button>
        <h1> {second} </h1>
        <button onClick={()=> setSecond("Large data has been changed")}
        className='px-3 py-2 rounded-md bg-red-400 text-white mt-2'> Change large data</button>
    </div>
  )
}

export default Services