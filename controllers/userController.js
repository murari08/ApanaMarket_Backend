const db = require("../database/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


// add

exports.addProduct = (req,res) => {
    try{
        console.log("add products")
            const  {name,star, price,descreption} = req.body;

            const image = req.files["productimg"] ? req.files["productimg"][0].filename : '';

            db.query("INSERT INTO products (Name, Image, Star, Descreption, Price,IsDraft) VALUES (?, ?, ?, ?, ? ,?)",
                [name, image, star, descreption, price,0],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    res.json({ id: result.insertId });
                }
            );
    }catch(e){
        console.log(e)
    }
   
}


// exports.addOrder = (req,res) => {
//     try{

//         console.log('add order')
//         const {cartList} = req.body;
//         console.log({cartList})
//         if (!Array.isArray(cartList) || cartList.length === 0) {
//             return res.status(400).json({ message: "Cart is empty" });
//           }

//           let processedCount = 0;
      
//           // Insert each item into `orders` or `order_items` table
//           cartList.forEach((item) => {
//             const { name, image, price, qty,star } = item;
//             const total = price * qty;
//             console.log({name, image, price, qty,star })
//             db.query(
//               "INSERT INTO `order` (Name, Image, star, Price, Qty) VALUES (?, ?, ?, ?, ?)",
//               [name, image, star, total, qty],
//               (err, result) => {
//                 if (err) console.error('Insert error:', err);
//               }
              
              
//             );
//           });
      
//           res.json({ message: 'Order stored successfully' });

//     }catch(e){
//         console.log(e)
//     }
// }

exports.addOrder = (req, res) => {
    try {
      console.log('add order');
      const { cartList } = req.body;
      console.log({ cartList });
  
      if (!Array.isArray(cartList) || cartList.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
  
      let processedCount = 0;
  
      cartList.forEach((item) => {
        const { name, image, price, qty, star } = item;
        const total = price * qty;
  
        db.query(
          "INSERT INTO `order` (Name, Image, Star, Price, Qty) VALUES (?, ?, ?, ?, ?)",
          [name, image, star, total, qty],
          (err, result) => {
            if (err) {
              console.error('Insert error:', err);
              return res.status(500).json({ error: 'Failed to insert order item.' });
            }
  
            processedCount++;
            if (processedCount === cartList.length) {
              // All inserts are done — now delete all cart data
              db.query("DELETE FROM `addcart`", (delErr) => {
                if (delErr) {
                  console.error('Delete all cart error:', delErr);
                  return res.status(500).json({ error: 'Failed to clear cart.' });
                }
  
                return res.json({ message: 'Order stored and entire cart cleared successfully' });
              });
            }
          }
        );
      });
  
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Server error' });
    }
  };
  

exports.addCart = (req,res) => {
    try{
        console.log('add cart')
        const {name,image,star, price} = req.body;
        console.log({name,image,star, price})
        db.query("INSERT INTO addcart (name, image, star, price,qty,qtyPrice) VALUES (?, ?, ?, ?, ? ,?)",
            [name, image, star, price, 1,price],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ id: result.insertId });
            }
        );
    }catch(e){
        console.log(e)
    }
}

// get

exports.getProducts = (req,res) => {
    try{
        console.log('get product')
        db.query("SELECT * FROM products Where IsDraft = 0", (err, results) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json(results);
            }
        });
    }catch(e){
        console.log(e)
    }
}

exports.getProductsName = (req,res) => {
    try{
        console.log('get product')
        db.query("SELECT Name FROM products Where IsDraft = 0", (err, results) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json(results);
            }
        });
    }catch(e){
        console.log(e)
    }
}

exports.getProductsNameItem = (req, res) => {
    try {
      const { name } = req.params;
      console.log('get product name:', name);
  
      db.query(
        "SELECT * FROM products WHERE IsDraft = 0 AND Name LIKE ?",
        [`%${name}%`],
        (err, results) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            res.json(results);
          }
        }
      );
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: 'Server error' });
    }
  };
  

exports.getOrder = (req,res) => {
    try{
        console.log('get product')
        db.query("SELECT * FROM `order`", (err, results) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json(results);
            }
        });
    }catch(e){
        console.log(e)
    }
}

exports.getCart = (req, res) => {
    try{
        db.query("SELECT * FROM addcart", (err, results) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json(results);
            }
        });
    }catch(e){
        console.log(e)
    }
}

exports.getProductById = (req,res) => {
    try{
        const {id} = req.params;
        db.query("SELECT * FROM products Where IsDraft = 0 AND Id = ? ", [id], (err, results) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json(results);
            }
        });

    }catch(e){

    }
}

// update 

exports.editProduct = (req,res) => {
    try{
        const { id } = req.params;
        const { name,star, price,descreption} = req.body;
        const image = req.files["productimg"] ? req.files["productimg"][0].filename : '';
        let query = "UPDATE products SET Name = ?, Star = ?, Descreption = ?, Price = ?";
        let values = [name, star, descreption, price];
    
        if (image) {  
            query += ", Image = ?";
            values.push(image);
        }
    
        query += " WHERE Id = ?";
        values.push(id);
        db.query(query, values, (err, result) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: "User updated successfully" });
            }
        });
    }catch(e){
        console.log(e)
    }
}


// delete 

exports.deleteProduct = (req,res) => {
    try{
        console.log("delete ")
        const { id } = req.params;
        console.log({id})
        db.query("UPDATE products set IsDraft = 1 WHERE Id = ?", [id], (err, result) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: "User deleted successfully" });
            }
        });
    }catch(e){
        console.log(e)
    }
}


// login signup

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    db.query("SELECT * FROM user_login WHERE Email = ?", [email], async (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.length > 0) return res.status(400).json({ error: "User already exists" });
        console.log({name, email, password })

      db.query(
        "INSERT INTO user_login (Name, Email, Password) VALUES (?, ?, ?)",
        [name, email, password],
        (err, result) => {
          if (err) return res.status(500).json({ error: err.message });

          const token = jwt.sign({ id: result.insertId, email }, process.env.JWT_SECRET, { expiresIn: "1d" });
          res.status(201).json({ message: "Signup successful", token });
        }
      );
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.userLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log({email, password})
    db.query("SELECT * FROM user_login WHERE Email = ? AND Password= ?", [email, password], async (err, results) => {
      if (err) return res.status(500).json({ error: "Server error" });
      if (results.length === 0) return res.status(401).json({ error: "Invalid email or password" });
        console.log({results})
        if (results.length > 0) {
            res.json({ message: true ,result:results});
        } else {
            res.json({ message: -1 });
        }
    });
  };

