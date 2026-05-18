import React, { useContext } from 'react'
import { ProductContext } from '../utils/Context';
import { Link } from 'react-router-dom';

const Nav = () => {

  const [products]= useContext(ProductContext);
  let distinct_category = 
     products && products.reduce((acc, cv) => [...acc, cv.category], []);
  distinct_category = [...new Set(distinct_category)];

  return (
    <nav className='w-[15%] bg-zinc-100 h-full flex flex-col items-center pt-5'>
        <a className='px-3 py-2 border rounded border-blue-200 text-blue-300' 
          href='/create'> Add New Product
        </a>
        <hr className='w-[80%] my-3'/>
        <h1 className='text-2xl w-[80%] mb-3'> Category Filter </h1>
        <div className='w-[80%]'>

        {distinct_category.map((c, i) =>(
          <Link 
          key={i}
          to={`/?category=${c}`}
          className='flex items-center mb-3'> 
            <span className='rounded-full mr-2 w-[15px] h-[15px] bg-blue-200'>{ } 
            </span>   {c}
          </Link>
        ))}
          
        </div>
      </nav>
  )
}

export default Nav