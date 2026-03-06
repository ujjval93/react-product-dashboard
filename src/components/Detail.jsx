import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Loding from './Loding';

const Detail = () => {

  const [product, setproduct] = useState(null);
  const { id } = useParams();

  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `https://fakestoreapi.com/products/${id}`
      );
      setproduct(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) getSingleProduct();
  }, [id]);

  if (!product) return <Loding />;

  return (
    <div className='w-[70%] min-h-screen flex justify-between items-center m-auto p-[10%]'>

      <img
        className='object-contain max-h-[350px] w-[40%]'
        src={product.image}
        alt={product.title}
      />

      <div className='content w-[50%]'>
        <h1 className='text-3xl font-bold text-black'>
          {product.title}
        </h1>

        <h2 className='text-gray-600 my-4'>
          {product.category}
        </h2>

        <h3 className='text-green-600 mb-3 font-semibold text-xl'>
          ₹ {product.price}
        </h3>

        <p className='text-gray-700 mb-5'>
          {product.description}
        </p>

        <Link className='px-3 py-2 mr-5 border rounded border-blue-400 text-blue-500'>
          Edit
        </Link>
        <Link className='px-3 py-2 border rounded border-red-400 text-red-500'>
          Delete
        </Link>
      </div>
    </div>
  )
}

export default Detail;
