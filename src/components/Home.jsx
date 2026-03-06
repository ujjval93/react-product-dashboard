import React, { useContext, useEffect, useState } from 'react'
import Nav from './Nav'
import { Link, useLocation } from 'react-router-dom'
import { ProductContext } from '../utils/Context';
import Loding from './Loding';
import axios from '../utils/axios';

const Home = () => {

  const [products] = useContext(ProductContext);
  const { search } = useLocation();

  const category = search ? decodeURIComponent(search.split("=")[1]) : null;

  const [filteredProduct, setfilteredProduct] = useState([]);

  const getProductscategory = async () => {
    try {
      const { data } = await axios.get(`/products/category/${category}`);
      setfilteredProduct(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (category) {
      getProductscategory();       
    } else {
      setfilteredProduct(products); 
    }
  }, [category, products]);

  if (!products || products.length === 0) {
    return <Loding />;
  }

  return (
    <>
      <Nav />

      <div className='w-[85%] h-full p-10 pt-[5%] flex flex-wrap overflow-x-hidden overflow-y-auto'>
        {filteredProduct.map((p) => (
          <Link
            key={p.id}
            to={`/detail/${p.id}`}
            className='card h-[30vh] w-[18%] p-3 mb-3 mr-3 shadow rounded flex flex-col justify-center items-center'
          >
            <div
              className='w-full h-[80%] bg-contain bg-no-repeat bg-center mb-3 hover:scale-110'
              style={{ backgroundImage: `url(${p.image})` }}
            />
            <h2 className='hover:text-blue-200 text-sm text-center'>
              {p.title}
            </h2>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Home;
