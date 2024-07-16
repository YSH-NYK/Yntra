const port = 4000;
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

// Middleware
app.use(express.json());
app.use(cors());

// Database connection with increased timeout settings
mongoose.connect("mongodb+srv://YashNaik:Yash%4032109@cluster0.jfxvsj4.mongodb.net/Yntra", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

// Root route
app.get("/", (req, res) => {
  res.send("Express app running");
});

// Image storage engine configuration
const storage = multer.diskStorage({
  destination: path.join(__dirname, 'upload/images'), // Absolute path to store uploads
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'upload/images')));

// File upload route
app.post("/upload", upload.single('product'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: 0, message: 'No file uploaded' });
  }
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  });
});

// Product model
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    }
});

// Add product route with retry logic
app.post('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }
    else{
        id=1;
    }
    const retries = 3; // Number of retries
    let success = false;
    let error = null;

    for (let i = 0; i < retries; i++) {
        try {
            const newProduct = new Product({
                id:id,
                name: req.body.name,
                image: req.body.image,
                category: req.body.category,
                new_price: req.body.new_price,
                old_price: req.body.old_price,
            });

            console.log(newProduct); // Log the product being saved

            await newProduct.save();

            console.log('Product saved');
            success = true;
            break; // Exit loop if successful
        } catch (err) {
            console.error(`Error saving product (attempt ${i + 1}/${retries}):`, err); // Log the error
            error = err;
        }
    }

    if (success) {
        res.json({
            success: true,
            name: req.body.name,
        });
    } else {
        res.status(500).json({
            success: false,
            error: 'Error saving product after retries',
            details: error ? error.message : 'Unknown error',
        });
    }
});

//creating api for delete pdt
app.post('/removeproduct',async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("removed");
    res.json({
        success:true,
        name:req.body.name,
    })
})

//Creating Api for getting all products
app.get('/allproducts',async(req,res)=>{
    let products = await Product.find({});
    console.log("All product fetched");
    res.send(products);
})

//schema for user 
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartdata: { type: Array, default: [] },
    date: { type: Date, default: Date.now },
});

const Users = mongoose.model('Users', userSchema);

// Signup route
app.post('/signup', async (req, res) => {
    let user = await Users.find({});
    let id;
    if (user.length > 0) {
        let last_user = user.slice(-1)[0];
        id = last_user.id + 1;
    } else {
        id = 1;
    }

    const retries = 3; // Number of retries
    let success = false;
    let error = null;

    for (let i = 0; i < retries; i++) {
        try {
            const newUser = new Users({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                cartdata: req.body.cartdata || [], // Assuming cartdata comes from the request
                date: req.body.date,
            });

            console.log(newUser); // Log the user being saved

            await newUser.save();

            console.log('User saved');
            success = true;
            break; // Exit loop if successful
        } catch (err) {
            console.error(`Error saving user (attempt ${i + 1}/${retries}):`, err); // Log the error
            error = err;
        }
    }

    if (success) {
        res.json({
            success: true,
            name: req.body.name,
        });
    } else {
        res.status(500).json({
            success: false,
            error: 'Error saving user after retries',
            details: error ? error.message : 'Unknown error',
        });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        
        // Generate token
        const token = jwt.sign({ user: { id: user._id } }, 'secret_ecom', { expiresIn: '1h' });
        
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//creating new collection of home page
app.get('/newcollection',async (req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("newcollection fetched");
    res.send(newcollection);
})

//creating popular for home page
app.get('/popular',async (req,res)=>{
    let products = await Product.find({category:"women"});
    let popular = products.slice(0,4);
    console.log("popular fetched");
    res.send(popular);
})

// Middleware to fetch user from token
const fetchuser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ errors: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, 'secret_ecom');
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ errors: "Please authenticate using a valid token" });
    }
}

// Add to cart route
app.post('/addtocart', fetchuser, async (req, res) => {
    try {
        const user = await Users.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingItem = user.cartdata.find(item => item.itemId === req.body.itemId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cartdata.push({ itemId: req.body.itemId, quantity: 1 });
        }

        await user.save();

        res.json({
            success: true,
            cartdata: user.cartdata,
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//creating

app.post('/getcart',fetchuser,async (req,res)=>{
    console.log("getCart");
    let userData = await Users.findOne({_id:req.user.id})
    res.json(userData.cartdata);
})

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
