const env = require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

var ObjectId = require("mongodb").ObjectId;

//require Schemas (Mongoose and Yup)
const {
  Admin,
  adminRegisterSchema,
  adminLoginSchema,
} = require("../models/admin.model");

const { Seller } = require("../models/seller.model");
const { Customer } = require("../models/customer.model");
const {
  Author,
  addAuthorSchema,
  authorUpdateSchema,
} = require("../models/author.model");

const {
  Manufacturer,
  yupManufacturerSchema,
} = require("../models/manufacterer.model");

const {
  Group,
  addGroupSchema,
  groupUpdateSchema,
} = require("../models/group.model");
const {
  Shop,
  shopYupSchema,
  shopYupUpdateAddressSchema,
} = require("../models/shop.model");
const { Contact } = require("../models/contact.model");

module.exports = {
  // // show  all Admins
  getAllAdmin: async (req, res) => {
    try {
      // get all admins data except password property
      let admin = await Admin.find({}, "-password");

      if (admin) {
        res.status(200).send({
          status: "success",
          message: "Admins got successfully",
          data: admin,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Admin not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      res.status(500).json({
        status: "fail",
        error: `Internal server Error 1`,
      });
    }
  },

  getAdminById: async (req, res) => {
    try {
      const adminId = req?.adminId;

      // get desired admin data except password
      const admin = await Admin.findById(adminId, "-password");

      if (admin) {
        res.status(200).send({
          status: "success",
          message: "Admin founded",
          data: admin,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Admin not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      res.status(500).json({
        status: "fail",
        error: `Internal server Error 2`,
      });
    }
  },

  // <--------Sellers-------------->

  // // show  all Sellers
  getAllSeller: async (req, res) => {
    try {
      // get all sellers data except password property
      let seller = await Seller.find({}, "-password");

      if (seller) {
        res.status(200).send({
          status: "success",
          message: "Sellers got successfully",
          data: seller,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Seller not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      res.status(500).json({
        status: "fail",
        error: `Internal server Error`,
      });
    }
  },
  // get seller  by id
  getSellerById: async (req, res) => {
    try {
      const sellerId = req.params?.sellerId;

      // get desired seller data except password
      const seller = await Seller.findById(sellerId, "-password");

      if (seller) {
        res.status(200).send({
          status: "success",
          message: "Seller founded",
          data: seller,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Seller not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);

      if (error.name === "CastError") {
        res.status(500).json({
          status: "fail",
          error: `Invalid ID fomate `,
        });
      } else {
        res.status(500).json({
          status: "fail",
          error: `Internal server Error `,
        });
      }
    }
  },

  // delete seller
  deleteSeller: async (req, res) => {
    try {
      const sellerId = req.params?.sellerId;

      let deletedResult = await Seller.findByIdAndDelete(sellerId);

      if (deletedResult) {
        res.status(200).send({
          status: "fail",
          message: "Seller deleted",
          data: deletedResult,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Seller not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      res.status(500).json({
        status: "fail",
        error: `Internal server Error`,
      });
    }
  },

  // <---------------customer--------------->

  // show  all Customers
  getAllCustomer: async (req, res) => {
    try {
      // get all customers data except password property
      let customer = await Customer.find({}, "-password");

      if (customer) {
        res.status(200).send({
          status: "success",
          message: "Customers got successfully",
          data: customer,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Customer not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      res.status(500).json({
        status: "fail",
        error: `Internal server Error`,
      });
    }
  },
  // get customer by id
  getCustomerById: async (req, res) => {
    try {
      const customerId = req.params?.customerId;

      // get desired customer data except password
      const customer = await Customer.findById(customerId, "-password");

      if (customer) {
        res.status(200).send({
          status: "success",
          message: "Customer founded",
          data: customer,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Customer not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      if (error.name === "CastError") {
        res.status(500).json({
          status: "fail",
          error: `Invalid ID fomate `,
        });
      } else {
        res.status(500).json({
          status: "fail",
          error: `Internal server Error `,
        });
      }
    }
  },
  // delete customer
  deleteCustomer: async (req, res) => {
    try {
      const customerId = req.params?.customerId;

      let deletedResult = await Customer.findByIdAndDelete(customerId);

      if (deletedResult) {
        res.status(200).send({
          status: "fail",
          message: "Customer deleted",
          data: deletedResult,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Customer not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      res.status(500).json({
        status: "fail",
        error: `Internal server Error`,
      });
    }
  },

  // <------------Groups-------------->

  addGroup: async (req, res) => {
    try {
      let groupData = req.body;

      groupData &&
        (await addGroupSchema.validate(groupData, {
          abortEarly: false,
        }));

      let group = await Group.findOne({ name: groupData?.name });

      // validate same name
      if (group) {
        res.status(400).json({
          status: "fail",
          error: "Try another group name",
        });
      } else {
        group = new Group(groupData);

        const result = await group.save();

        result &&
          res.status(200).send({
            status: "success",
            message: "Group added Successfully",
            data: result,
          });
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};

        error.inner &&
          error.inner.length > 0 &&
          error.inner.forEach((validationError) => {
            validationErrors[validationError.path] = validationError.message;
          });

        const entries = Object.entries(validationErrors);
        entries &&
          entries.length > 0 &&
          res.status(400).json({
            status: "fail",
            error: entries[0][1],
          });
      } else {
        console.log("internal server error", error);
        res.status(500).json({
          status: "fail",
          error: `Internal server Error`,
        });
      }
    }
  },

  // // show  all Groups
  getAllGroup: async (req, res) => {
    try {
      // get all groups data
      let group = await Group.find({});

      if (group) {
        res.status(200).send({
          status: "success",
          message: "Groups got successfully",
          data: group,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Group not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      res.status(500).json({
        status: "fail",
        error: `Internal server Error`,
      });
    }
  },

  getGroupById: async (req, res) => {
    try {
      const groupId = req.params?.groupId;

      // get desired group data
      const group = await Group.findById(groupId);

      if (group) {
        res.status(200).send({
          status: "success",
          message: "Group founded",
          data: group,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Group not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      if (error.name === "CastError") {
        res.status(500).json({
          status: "fail",
          error: `Invalid ID fomate `,
        });
      } else {
        res.status(500).json({
          status: "fail",
          error: `Internal server Error `,
        });
      }
    }
  },

  updateGroup: async (req, res) => {
    try {
      const groupId = req?.params?.groupId;

      const updateFields = req.body;

      updateFields &&
        (await groupUpdateSchema.validate(updateFields, {
          abortEarly: false,
        }));

      const group = await Group.findById(groupId);

      if (!group) {
        return res
          .status(404)
          .json({ status: "fail", error: "Group not found" });
      }

      // Loop through the updateFields object to dynamically update each field
      for (const field in updateFields) {
        if (Object.hasOwnProperty.call(updateFields, field)) {
          // Check if the field exists in the group schema
          if (group.schema.path(field)) {
            // Update the field with the new value
            group[field] = updateFields[field];
          }
        }
      }

      // let isNameExist = await Group.findOne({ name: group?.name });

      // // validate email exist
      // if (isNameExist) {
      //   console.log("pre-finded group id", group?._id);
      //   console.log("Current-finded group id", isNameExist?._id);

      //   if (isNameExist?._id != group?._id) {
      //     res.status(400).json({
      //       status: "fail",
      //       error: "-------Try another group name ",
      //     });
      //   }
      // } else {
      //   // Save the updated group document
      const updatedGroup = await group.save();

      updatedGroup &&
        res.status(200).json({
          status: "success",
          message: "Group updated successfully",
          data: updatedGroup,
        });
      // }
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};

        error.inner &&
          error.inner.length > 0 &&
          error.inner.forEach((validationError) => {
            validationErrors[validationError.path] = validationError.message;
          });

        const entries = Object.entries(validationErrors);
        entries &&
          entries.length > 0 &&
          res.status(400).json({
            status: "fail",
            error: entries[0][1],
          });
      } else {
        console.log("internal server error", error);
        res.status(500).json({
          status: "fail",
          error: `Internal server Error`,
        });
      }
    }
  },

  deleteGroup: async (req, res) => {
    try {
      const groupId = req.params?.groupId;

      let deletedResult = await Group.findByIdAndDelete(groupId);

      if (deletedResult) {
        res.status(200).send({
          status: "fail",
          message: "Group deleted",
          data: deletedResult,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Group not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      res.status(500).json({
        status: "fail",
        error: `Internal server Error`,
      });
    }
  },

  // <------------------Author-------------------->

  addAuthor: async (req, res) => {
    try {
      let authorData = req.body;

      authorData &&
        (await addAuthorSchema.validate(authorData, {
          abortEarly: false,
        }));

      const author = new Author(authorData);

      const result = await author.save();

      result &&
        res.status(200).send({
          status: "success",
          message: "Author added Successfully",
          data: result,
        });
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};

        error.inner &&
          error.inner.length > 0 &&
          error.inner.forEach((validationError) => {
            validationErrors[validationError.path] = validationError.message;
          });

        const entries = Object.entries(validationErrors);
        entries &&
          entries.length > 0 &&
          res.status(400).json({
            status: "fail",
            error: entries[0][1],
          });
      } else {
        console.log("internal server error", error);
        res.status(500).json({
          status: "fail",
          error: `Internal server Error`,
        });
      }
    }
  },

  // // show  all Authors
  getAllAuthor: async (req, res) => {
    try {
      // get all authors data except password property
      let author = await Author.find({});

      if (author) {
        res.status(200).send({
          status: "success",
          message: "Authors got successfully",
          data: author,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Author not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      res.status(500).json({
        status: "fail",
        error: `Internal server Error`,
      });
    }
  },

  getAuthorById: async (req, res) => {
    try {
      const authorId = req.params?.authorId;

      // get desired author data
      const author = await Author.findById(authorId);

      if (author) {
        res.status(200).send({
          status: "success",
          message: "Author founded",
          data: author,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Author not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);

      if (error.name === "CastError") {
        res.status(500).json({
          status: "fail",
          error: `Invalid ID fomate `,
        });
      } else {
        res.status(500).json({
          status: "fail",
          error: `Internal server Error `,
        });
      }
    }
  },

  updateAuthor: async (req, res) => {
    try {
      const authorId = req?.params?.authorId;

      const updateFields = req.body;

      updateFields &&
        (await authorUpdateSchema.validate(updateFields, {
          abortEarly: false,
        }));

      const author = await Author.findById(authorId);

      if (!author) {
        return res
          .status(404)
          .json({ status: "fail", error: "Author not found" });
      }

      // Loop through the updateFields object to dynamically update each field
      for (const field in updateFields) {
        if (Object.hasOwnProperty.call(updateFields, field)) {
          // Check if the field exists in the author schema
          if (author.schema.path(field)) {
            // Update the field with the new value
            author[field] = updateFields[field];
          }
        }
      }

      // Save the updated author document
      const updatedAuthor = await author.save();

      res.status(200).json({
        status: "success",
        message: "Author updated successfully",
        data: updatedAuthor,
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};

        error.inner &&
          error.inner.length > 0 &&
          error.inner.forEach((validationError) => {
            validationErrors[validationError.path] = validationError.message;
          });

        const entries = Object.entries(validationErrors);
        entries &&
          entries.length > 0 &&
          res.status(400).json({
            status: "fail",
            error: entries[0][1],
          });
      } else {
        console.log("internal server error", error);
        res.status(500).json({
          status: "fail",
          error: `Internal server Error: ${error}`,
        });
      }
    }
  },

  deleteAuthor: async (req, res) => {
    try {
      const authorId = req.params?.authorId;

      let deletedResult = await Author.findByIdAndDelete(authorId);

      if (deletedResult) {
        res.status(200).send({
          status: "fail",
          message: "Author deleted",
          data: deletedResult,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Author not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      res.status(500).json({
        status: "fail",
        error: `Internal server Error`,
      });
    }
  },

  // <------------------Manufacturer-------------------->

  addManufacturer: async (req, res) => {
    try {
      let manufacturerData = req.body;

      manufacturerData &&
        (await yupManufacturerSchema.validate(manufacturerData, {
          abortEarly: false,
        }));
      const groupExist = await Group.findById(manufacturerData?.groupId);
      if (groupExist) {
        const manufacturer = new Manufacturer(manufacturerData);

        const result = await manufacturer.save();

        result &&
          res.status(200).send({
            status: "success",
            message: "Manufacturer added Successfully",
            data: result,
          });
      } else {
        res.status(401).send({
          status: "fail",
          error: "Group not found",
        });
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};

        error.inner &&
          error.inner.length > 0 &&
          error.inner.forEach((validationError) => {
            validationErrors[validationError.path] = validationError.message;
          });

        const entries = Object.entries(validationErrors);
        entries &&
          entries.length > 0 &&
          res.status(400).json({
            status: "fail",
            error: entries[0][1],
          });
      } else {
        console.log("internal server error", error);
        res.status(500).json({
          status: "fail",
          error: `Internal server Error`,
        });
      }
    }
  },

  // // show  all Manufacturers
  getAllManufacturer: async (req, res) => {
    try {
      // get all manufacturers data
      let manufacturer = await Manufacturer.find({});

      if (manufacturer) {
        res.status(200).send({
          status: "success",
          message: "Manufacturers got successfully",
          data: manufacturer,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Manufacturer not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      res.status(500).json({
        status: "fail",
        error: `Internal server Error`,
      });
    }
  },

  getManufacturerById: async (req, res) => {
    try {
      const manufacturerId = req.params?.manufacturerId;

      // get desired manufacturer data
      const manufacturer = await Manufacturer.findById(manufacturerId);

      if (manufacturer) {
        res.status(200).send({
          status: "success",
          message: "Manufacturer founded",
          data: manufacturer,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Manufacturer not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);

      if (error.name === "CastError") {
        res.status(500).json({
          status: "fail",
          error: `Invalid ID fomate `,
        });
      } else {
        res.status(500).json({
          status: "fail",
          error: `Internal server Error `,
        });
      }
    }
  },

  updateManufacturer: async (req, res) => {
    try {
      const manufacturerId = req?.params?.manufacturerId;

      const updateFields = req.body;

      updateFields &&
        (await yupManufacturerSchema.validate(updateFields, {
          abortEarly: false,
        }));

      const manufacturer = await Manufacturer.findById(manufacturerId);

      if (!manufacturer) {
        return res
          .status(404)
          .json({ status: "fail", error: "Manufacturer not found" });
      }

      // Loop through the updateFields object to dynamically update each field
      for (const field in updateFields) {
        if (Object.hasOwnProperty.call(updateFields, field)) {
          // Check if the field exists in the manufacturer schema
          if (manufacturer.schema.path(field)) {
            // Update the field with the new value
            manufacturer[field] = updateFields[field];
          }
        }
      }

      const groupExist = await Group.findById(manufacturer?.groupId);
      if (groupExist) {
        // Save the updated manufacturer document
        const updatedManufacturer = await manufacturer.save();

        res.status(200).json({
          status: "success",
          message: "Manufacturer updated successfully",
          data: updatedManufacturer,
        });
      } else {
        res.status(401).send({
          status: "fail",
          error: "Group not found",
        });
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};

        error.inner &&
          error.inner.length > 0 &&
          error.inner.forEach((validationError) => {
            validationErrors[validationError.path] = validationError.message;
          });

        const entries = Object.entries(validationErrors);
        entries &&
          entries.length > 0 &&
          res.status(400).json({
            status: "fail",
            error: entries[0][1],
          });
      } else {
        console.log("internal server error", error);
        res.status(500).json({
          status: "fail",
          error: `Internal server Error: ${error}`,
        });
      }
    }
  },

  deleteManufacturer: async (req, res) => {
    try {
      const manufacturerId = req.params?.manufacturerId;

      let deletedResult = await Manufacturer.findByIdAndDelete(manufacturerId);

      if (deletedResult) {
        res.status(200).send({
          status: "fail",
          message: "Manufacturer deleted",
          data: deletedResult,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Manufacturer not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      res.status(500).json({
        status: "fail",
        error: `Internal server Error`,
      });
    }
  },

  // =====================================================================================================================

  // <------------------Shop-------------------->

  addShop: async (req, res) => {
    try {
      // debugger;

      let shopData = req.body;

      shopData &&
        (await shopYupSchema.validate(shopData, {
          abortEarly: false,
        }));

      const sellerExist = await Seller.findById(
        shopData?.sellerId,
        "-password"
      );

      if (sellerExist) {
        const shop = new Shop(shopData);

        const result = await shop.save();
        result &&
          res.status(200).send({
            status: "success",
            message: "Shop added Successfully",
            data: result,
          });
      } else {
        res.status(400).send({
          status: "fail",
          error: "SellerId not Found",
        });
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};

        error.inner &&
          error.inner.length > 0 &&
          error.inner.forEach((validationError) => {
            validationErrors[validationError.path] = validationError.message;
          });

        const entries = Object.entries(validationErrors);
        entries &&
          entries.length > 0 &&
          res.status(400).json({
            status: "fail",
            error: entries[0][1],
          });

        console.log("error:---", error);
        return res.status(400).json(error?.message);
      } else {
        console.log("internal server error", error);
        res.status(500).json({
          status: "fail",
          error: `Internal server Error`,
        });
      }
    }
  },
  // // show  all Shops
  getAllShops: async (req, res) => {
    try {
      let shop = await Shop.find({});

      if (shop) {
        res.status(200).send({
          status: "success",
          message: "Shops got successfully",
          data: shop,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Shop not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      res.status(500).json({
        status: "fail",
        error: `Internal server Error`,
      });
    }
  },

  getShopById: async (req, res) => {
    try {
      const shopId = req.params?.shopId;
      // get desired shop data
      const shop = await Shop.findById(shopId);

      if (shop) {
        res.status(200).send({
          status: "success",
          message: "Shop founded",
          data: shop,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Shop not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);

      if (error.name === "CastError") {
        res.status(500).json({
          status: "fail",
          error: `Invalid ID fomate `,
        });
      } else {
        res.status(500).json({
          status: "fail",
          error: `Internal server Error `,
        });
      }
    }
  },

  updateShop: async (req, res) => {
    try {
      const shopId = req?.params?.shopId;

      const updateFields = req.body;

      updateFields &&
        (await shopYupSchema.validate(updateFields, {
          abortEarly: false,
        }));

      const shop = await Shop.findById(shopId);

      if (!shop) {
        return res
          .status(404)
          .json({ status: "fail", error: "Shop not found" });
      }

      // Loop through the updateFields object to dynamically update each field
      for (const field in updateFields) {
        if (Object.hasOwnProperty.call(updateFields, field)) {
          // Check if the field exists in the shop schema
          if (shop.schema.path(field)) {
            // Update the field with the new value
            shop[field] = updateFields[field];
          }
        }
      }

      const sellerExist = await Seller.findById(shop?.sellerId, "-password");

      if (sellerExist) {
        // Save the updated shop document
        const updatedShop = await shop.save();

        res.status(200).json({
          status: "success",
          message: "Shop updated successfully",
          data: updatedShop,
        });
      } else {
        res.status(400).send({
          status: "fail",
          error: "SellerId not Found",
        });
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};

        error.inner &&
          error.inner.length > 0 &&
          error.inner.forEach((validationError) => {
            validationErrors[validationError.path] = validationError.message;
          });

        const entries = Object.entries(validationErrors);
        entries &&
          entries.length > 0 &&
          res.status(400).json({
            status: "fail",
            error: entries[0][1],
          });
      } else {
        console.log("internal server error", error);
        res.status(500).json({
          status: "fail",
          error: `Internal server Error: ${error}`,
        });
      }
    }
  },

  updateShopAddresses: async (req, res) => {
    try {
      const shopId = req?.params?.shopId;

      // Get the shop document by ID
      const shop = await Shop.findById(shopId);

      if (!shop) {
        return res
          .status(404)
          .json({ status: "fail", error: "Shop not found" });
      }
      console.log("body", req.body);
      req?.body &&
        (await shopYupUpdateAddressSchema.validate(req?.body, {
          abortEarly: false,
        }));

      const { country, city, state, zip, streetAddress } = req.body;
      shop.shopAddress = {
        country,
        city,
        state,
        zip,
        streetAddress,
      };

      // Save the updated shop document
      const updatedShop = await shop.save();

      res.status(200).json({
        status: "success",
        message: `shop address updated successfully`,
        data: updatedShop,
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};

        error.inner &&
          error.inner.length > 0 &&
          error.inner.forEach((validationError) => {
            validationErrors[validationError.path] = validationError.message;
          });

        const entries = Object.entries(validationErrors);
        entries &&
          entries.length > 0 &&
          res.status(400).json({
            status: "fail",
            error: entries[0][1],
          });
      } else {
        console.log("internal server error", error);
        res.status(500).json({
          status: "fail",
          error: `Internal server Error: ${error}`,
        });
      }
    }
  },

  deleteShop: async (req, res) => {
    try {
      const shopId = req.params?.shopId;

      let deletedResult = await Shop.findByIdAndDelete(shopId);
      console.log(shopId, deletedResult);

      if (deletedResult) {
        res.status(200).send({
          status: "fail",
          message: "Shop deleted",
          data: deletedResult,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Shop not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      res.status(500).json({
        status: "fail",
        error: `Internal server Error`,
      });
    }
  },

  // <------------------Contact Us-------------------->

  // // show  all Contacts
  getAllContacts: async (req, res) => {
    try {
      let contact = await Contact.find({});

      if (contact) {
        res.status(200).send({
          status: "success",
          message: "Contacts got successfully",
          data: contact,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Contact not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);
      res.status(500).json({
        status: "fail",
        error: `Internal server Error`,
      });
    }
  },

  getContactById: async (req, res) => {
    try {
      const contactId = req.params?.contactId;
      // get desired contact data
      const contact = await Contact.findById(contactId);

      if (contact) {
        res.status(200).send({
          status: "success",
          message: "Contact founded",
          data: contact,
        });
      } else {
        res.status(400).json({
          status: "fail",
          error: "Contact not found",
        });
      }
    } catch (error) {
      console.log("internal server error", error);

      if (error.name === "CastError") {
        res.status(500).json({
          status: "fail",
          error: `Invalid ID fomate `,
        });
      } else {
        res.status(500).json({
          status: "fail",
          error: `Internal server Error `,
        });
      }
    }
  },
};
