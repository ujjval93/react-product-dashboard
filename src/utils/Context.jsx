import React, { createContext, useEffect, useState } from "react";
import Axios from "./axios";

export const ProductContext = createContext();

const Context = (props) => {

  const [products, setproduct] = useState(
    JSON.parse(localStorage.getItem("products")) || []
  );

  const getProduct = async () => {
    try {
      const { data } = await Axios("/products");
      setproduct(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if(products.length === 0){
      getProduct();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  return (
    <ProductContext.Provider value={[products, setproduct]}>
      {props.children}
    </ProductContext.Provider>
  );
};

export default Context;
