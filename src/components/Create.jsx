import React, { useContext, useState } from 'react'
import { ProductContext } from '../utils/Context';
import {nanoid} from 'nanoid';

const Create = () => {

    const [products, setProducts]=useContext(ProductContext)

    const [title, setTitle]= useState("");
    const [image, setImage]= useState("");
    const [price, setPrice]= useState("");
    const [category, setCategory]= useState("");
    const [description, setDescription]= useState("");

    const addProductHandler = (e) => {
        e.preventDefault();

        if(title.trim().length < 5 || 
            image.trim().length < 5 ||
            category.trim().length < 5 ||
            description.trim().length < 5 ||
              price === "" ){
                alert("each and every input must have atleast 4 character")
                return;
            }
        const product = {
            id: nanoid(),
            title, image, category, price, description,
        };
        setProducts([...products, product]);
    };

  return (
    <form onSubmit={addProductHandler}
        className='p-[5%] w-screen h-screen flex flex-col items-center'>
        <h1 className='text-2xl font-semibold w-1/2 mb-3'>Add New Product </h1>
        <input 
        type='url'
        placeholder='image'
        className='w-1/2 bg-zinc-100 text-1xl mb-3 p-2 rounded'
        onChange={(e) => setImage(e.target.value)}
        value={image}
        />

        <input 
        type='text'
        placeholder='title'
        className='w-1/2 bg-zinc-100 text-1xl mb-3 p-2 rounded'
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        />
        <div className='w-1/2 flex gap-3'>
            <input 
               type='text'
               placeholder='category'
               className='w-1/2 bg-zinc-100 text-1xl mb-3 p-2 rounded'
               onChange={(e) => setCategory(e.target.value)}
                value={category}
             />

            <input 
                type='number'
                placeholder='price'
                className='w-1/2 bg-zinc-100 text-1xl mb-3 p-2 rounded'
                onChange={(e) => setPrice(e.target.value)}
                value={price}
            />
        </div>

        <textarea 
        className='w-1/2 bg-zinc-100 text-1xl mb-3 p-2 rounded'
        rows={10}
        placeholder='Type Product Description Here...'
        onChange={(e) => setDescription(e.target.value)}
        value={description}></textarea>

        <div className='w-1/2'>
            <button className='px-3 py-2 border rounded border-blue-200 text-blue-300' > 
                   Add New Product
            </button>
        </div>

    </form>
  )
}

export default Create