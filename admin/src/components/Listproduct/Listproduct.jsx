import React, { useEffect, useState } from 'react'
import './Listproduct.css'
import cross from '../../assets/cross_icon.png'
const Listproduct = () => {

    const [allproducts,setAllproducts] = useState([]);
    const fetchinfo = async () => {
      await fetch('http://localhost:4000/allproducts')
      .then((res)=>res.json())
      .then((data)=>{setAllproducts(data)})
    }

    useEffect(()=>{
      fetchinfo();
    },[])

    const removepdt = async (id) => {
      await fetch('http://localhost:4000/removeproduct',{
        method:'POST',
        headers:{
          Accept:'application/json',
          'Content-Type':'application/json',
        },
        body:JSON.stringify({id:id})
      })
      await fetchinfo();
    }

  return (
    <div className='Listproduct'>
      <h1>Product List</h1>
      <div className="mainformat">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listallpdt">
        <hr />
         {allproducts.map((product,index)=>{
              return <div key={index} className="mainformat listpdtformat">
                    <img className='pdticon' src={product.image} alt="" />
                    <p>{product.name}</p>
                    <p>${product.old_price}</p>
                    <p>${product.new_price}</p>
                    <p>{product.category}</p>
                    <img  onClick={()=>{removepdt(product.id)}} className='removeicon' src={cross} alt="" />
              </div>
            
         })}
      </div>
    </div>
  )
}

export default Listproduct