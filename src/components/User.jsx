import React, { useEffect, useState } from 'react'
import axios from 'axios';

const User = () => {
    const [product, setproduct]= useState([]);

    const getproduct = () => {

    const API = "https://fakestoreapi.com/products";
    axios.get(API)
    .then((product) => {
      console.log(product)
      setproduct(product.data)
    })
        .catch((error)=> console.log(error));
    }

    useEffect(()=>{
        getproduct();
    }, []);
  return (
    <>
        <button onClick={getproduct} 
            className='px-3 py-2 bg-red-500 text-white rounded-md mb-10'>
            Call Product API 
        </button>

       <ul>

            {product.length >0 ? product.map(p => 
            <li key={p.id} className='rounded p-5 bg-red-300 mb-5'> {p.title} </li>) : 
            <h1 className='p-30 ml-80 mt-20 text-2xl font-bold'> Loding....</h1>}
        
        </ul>
    
    </>

  )
}

export default User