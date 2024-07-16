import React, { useState } from 'react'
import './Addproduct.css'
import uplploadarea from '../../assets/upload_area.svg'
const Addproduct = () => {

    const [image,setImage] = useState(false);
    const[ProductDetails,setProductDetails] = useState({
        name:"",
        image:"",
        category:"men",
        new_price:"",
        old_price:""
    })
    const imagehandler = (e) => {
        setImage(e.target.files[0]);
    }
    const changeHandler = (e) => {
        setProductDetails({...ProductDetails,[e.target.name]:e.target.value})
    }
    const addproduct = async ()=>{
        console.log(ProductDetails);
        let responsedata;
        let product = ProductDetails;

        let formdata = new FormData();
        formdata.append('product',image);

        await fetch('http://localhost:4000/upload',{
            method:'POST',
            headers:{
                Accept:'application/json',
            },
            body:formdata,
        }).then((resp) => 
        resp.json())
        .then((data)=>
        {responsedata=data});

        if(responsedata.success){
          product.image = responsedata.image_url;
          console.log(product);
          await fetch('http://localhost:4000/addproduct',{
            method:'POST',
            headers:{
                Accept:'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify(product),
          }).then((resp) => 
          resp.json())
          .then((data)=>
          {data.success?alert("Product Added"):alert("Failed")});
        }
    } 

    return (
        <div className='addproduct'>
            <div className="addpdttiem">
                <p>Product Title</p>
                <input type="text" value={ProductDetails.name} onChange={changeHandler} name="name" placeholder='Type here'/>
            </div>
            <div className="addpdtprice">
                <div className="additemfield">
                    <p>Price</p>
                    <input type="text" value={ProductDetails.old_price} onChange={changeHandler} name="old_price" placeholder='Type here'/>
                </div>
                <div className="additemfield">
                    <p>Offer Price</p>
                    <input type="text" value={ProductDetails.new_price} onChange={changeHandler} name="new_price" placeholder='Type here'/>
                </div>
            </div>
            <div className="additemfield">
                    <p>Product Category</p>
                    <select value={ProductDetails.category} onChange={changeHandler} name="category" id="selcat">
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                        <option value="kid">Kid</option>
                    </select>
                </div>
                <div className="additemfield">
                    <label htmlFor="file-input">
                        <img  src={image?URL.createObjectURL(image):uplploadarea} alt="" />
                    </label>
                    <input onChange= {imagehandler} type="file" name='image' id='file-input' hidden/>
                </div>
                <button onClick={()=>{addproduct()}} className='addpdt'>ADD</button>
        </div>
    )
}

export default Addproduct