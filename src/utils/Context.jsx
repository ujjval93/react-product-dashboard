import React, { createContext, useEffect, useState } from "react";
import Axios from "./axios";   // 👈 lowercase axios

export const ProductContext = createContext();

const Context = (props) => {
  const [products, setproduct] = useState([]);

  const getProduct = async () => {
    try {
      const { data } = await Axios("/products");
      setproduct(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <ProductContext.Provider value={[products, setproduct]}>
      {props.children}
    </ProductContext.Provider>
  );
};

export default Context;
