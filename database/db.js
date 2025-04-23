const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const multer = require("multer");


// Configure Multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage: storage });


router.post("/addProduct", upload.fields([{ name: "productimg" }]),userController.addProduct);
router.get("/getProduct",userController.getProducts);
router.get("/getProductName",userController.getProductsName);
router.get("/getProductByName/:name",userController.getProductsNameItem);
router.put("/deleteProduct/:id", userController.deleteProduct);
router.put("/updateProduct/:id",upload.fields([{ name: "productimg" }]),userController.editProduct);
router.get("/getProductById/:id",userController.getProductById);
router.post("/addCart",upload.none(), userController.addCart);
router.get("/getCart",userController.getCart);
router.post("/addOrder",upload.none(),userController.addOrder);
router.get("/getOrder",userController.getOrder);
router.post('/signup', userController.signup);
router.post('/userLogin', userController.userLogin);





module.exports = router;
