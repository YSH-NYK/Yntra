import React from 'react'
import './Sidebar.css'
import {Link} from 'react-router-dom'
import addpdticon from '../../assets/Product_Cart.png'
import listpdticn from '../../assets/Product_list_icon.png'


const Sidebar = () => {
  return (
    <div className='sidebar'>
        <Link to={'./addproduct'} style={{textDecoration:"none"}}>
            <div className="sidebar-item">
                <img src={addpdticon} alt="" />
                <p>Add Product</p>
            </div>
        </Link>
        <Link to={'./listproduct'} style={{textDecoration:"none"}}>
            <div className="sidebar-item">
                <img src={listpdticn} alt="" />
                <p>Product List</p>
            </div>
        </Link>
    </div>
  )
}

export default Sidebar