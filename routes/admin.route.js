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

// *********************************************
// router.delete("/*", adminController.noRoutFound);

//<-----------Shops----------->

router.post("/addShop", adminController.addShop);
// get all shops
router.get("/shops", adminController.getAllShops);
// get single author
router.get("/shop/:shopId", adminController.getShopById);
// dynamic update any field(Single or multiple) of author(only by admin)
router.put("/updateShop/:shopId", adminController.updateShop);
// update shop address after validation
router.patch("/shopAddress/:shopId", adminController.updateShopAddresses);
//---Delete shops by id
router.delete("/deleteShop/:shopId", adminController.deleteShop);

module.exports = router;
