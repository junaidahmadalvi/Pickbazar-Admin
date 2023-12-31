const express = require("express");
const router = express.Router();

// require controller
const adminController = require("../controllers/admin.controller");

// ****************All Routes*********************************************

// get all admins
router.get("/", adminController.getAllAdmin);
// get single admin
router.get("/", adminController.getAdminById);

//  < -----Sellers----------->

// get all sellers
router.get("/sellers", adminController.getAllSeller);
// get single seller
router.get("/seller/:sellerId", adminController.getSellerById);
//---Delete Seller by id
router.delete("/deleteSeller/:sellerId", adminController.deleteSeller);

// <-------------------Customer---------------->

// get all customers
router.get("/customers", adminController.getAllCustomer);
// get single customer
router.get("/customer/:customerId", adminController.getCustomerById);
//---Delete Customer by id
router.delete("/deleteCustomer:customerId", adminController.deleteCustomer);

// <-------------groups----------->

// add-group
router.post("/addGroup", adminController.addGroup);
// get all groups
router.get("/groups", adminController.getAllGroup);
// get single group
router.get("/group/:groupId", adminController.getGroupById);
// dynamic update any field(Single or multiple) of group(only by admin)
router.put("/updateGroup/:groupId", adminController.updateGroup);
//---Delete Group by id
router.delete("/deletegroup/:groupId", adminController.deleteGroup);

// <-------------categories----------->

// add-category
router.post("/addCategory", adminController.addCategory);
// get all categories
router.get("/categories", adminController.getAllCategory);
// get single category
router.get("/category/:categoryId", adminController.getCategoryById);
// dynamic update any field(Single or multiple) of category
router.put("/updateCategory/:categoryId", adminController.updateCategory);
//---Delete Category by id
router.delete("/deleteCategory/:categoryId", adminController.deleteCategory);

// <----------Products------------------------>

// add-product
router.post("/addProduct", adminController.addProduct);
// get all product
router.get("/products", adminController.getAllProduct);
// get single product
router.get("/product/:productId", adminController.getProductById);
// dynamic update any field(Single or multiple) of product
router.put("/updateProduct/:productId", adminController.updateProduct);
//---Delete Product by id
router.delete("/deleteProduct/:productId", adminController.deleteProduct);

// <----------Orders------------------------>

// add-order
router.post("/addOrder", adminController.addOrder);
// get all order
router.get("/orders", adminController.getAllOrder);
// get single order
router.get("/order/:orderId", adminController.getOrderById);
// dynamic update any field(Single or multiple) of order
router.put("/updateOrder/status/:orderId", adminController.updateOrderStatus);

// <----------------author--------------------->

// add-author
router.post("/addAuthor", adminController.addAuthor);
// get all authors
router.get("/authors", adminController.getAllAuthor);
// get single author
router.get("/author/:authorId", adminController.getAuthorById);
// dynamic update any field(Single or multiple) of author(only by admin)
router.put("updateAuthor/:authorId", adminController.updateAuthor);
//---Delete Author by id
router.delete("/deleteAuthor/:authorId", adminController.deleteAuthor);

// <----------------Manufacturer--------------------->

// add-manufacturer
router.post("/addManufacturer", adminController.addManufacturer);
// get all manufacturers
router.get("/manufacturers", adminController.getAllManufacturer);
// get single manufacturer
router.get(
  "/manufacturer/:manufacturerId",
  adminController.getManufacturerById
);
// dynamic update any field(Single or multiple) of manufacturer(only by admin)
router.put(
  "/updateManufacturer/:manufacturerId",
  adminController.updateManufacturer
);
//---Delete Manufacturer by id
router.delete(
  "/deleteManufacturer/:manufacturerId",
  adminController.deleteManufacturer
);

//<-----------Shops----------->

router.post("/addShop", adminController.addShop);
// get all shops
router.get("/shops", adminController.getAllShops);
// get single shop
router.get("/shop/:shopId", adminController.getShopById);
// dynamic update any field(Single or multiple) of shop(only by admin)
router.put("/updateShop/:shopId", adminController.updateShop);
// update shop address after validation
router.patch("/shopAddress/:shopId", adminController.updateShopAddresses);
//---Delete shops by id
router.delete("/deleteShop/:shopId", adminController.deleteShop);

//<-----------Contact Us----------->

// get all contact
router.get("/contacts", adminController.getAllContacts);
// get single contact
router.get("/contact/:contactId", adminController.getContactById);

module.exports = router;
