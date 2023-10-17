const {
  Admin,
  adminRegisterSchema,
  adminLoginSchema,
} = require("../models/admin.model");
const { Customer } = require("../models/customer.model");
const { Seller } = require("../models/seller.model");

const yup = require("yup");
const userAuthSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),

  password: yup
    .string()
    .required("Password is required")
    .min(4, "Password length must be 4"),
});
var ObjectId = require("mongodb").ObjectId;
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();

const bcrypt = require("bcrypt");

module.exports = {
  //----------< Authentification>  ------------------

  authenticateAdmin: async (req, res, next) => {
    console.log("Admin auth called");

    const authorizationHeader = req.headers["authorization"];

    // Check if the Authorization header exists and starts with 'Bearer '
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      // Extract the token (remove 'Bearer ' from the beginning)
      try {
        const token = authorizationHeader.slice(7);
        // Check if a token is provided
        if (!token) {
          return res
            .status(401)
            .json({ message: "Authentication token is missing." });
        } else {
          const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);

          const adminId = decode.adminId;
          req.adminId = adminId;

          // Get Admin from Token
          const admin = await Admin.findById(adminId);

          if (admin) {
            console.log("admin authenticated");
            next();
          } else {
            res
              .status(403)
              .json({ error: "Authentication failed. Invalid token." });
          }
        }
      } catch (error) {
        return res.status(401).json({
          status: "fail",
          error: error.message,
        });
      }
    } else {
      res.status(401).json({
        status: "fail",
        message: "Authentication token is missing.",
      });
    }
  },

  //admin register(individually)
  registerAdmin: async (req, res) => {
    try {
      let adminData = req.body;

      adminData &&
        (await adminRegisterSchema.validate(adminData, {
          abortEarly: false,
        }));

      let admin = await Admin.findOne({ email: adminData?.email });

      // validate email exist
      if (admin) {
        res.status(400).json({
          status: "fail",
          error: "email already exist",
        });
      } else {
        // validate password and confirmPassword match
        if (adminData?.password != adminData?.confirmPassword) {
          res.status(400).json({
            status: "fail",
            error: "Password and Confirm Password must be same",
          });
        } else {
          const salt = await bcrypt.genSalt(Number(process.env.SALT));
          const hashpswd = await bcrypt.hash(adminData?.password, salt);

          let requestData = {
            name: adminData?.name,
            email: adminData?.email,
            password: hashpswd,
          };

          admin = new Admin(requestData);

          const result = await admin.save();

          res.status(200).send({
            status: "success",
            message: "Admin added Successfully",
            data: result,
          });
        }
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

  // Admin login controller
  loginAdmin: async (req, res) => {
    try {
      const adminData = req.body;

      adminData &&
        (await adminLoginSchema.validate(adminData, {
          abortEarly: false,
        }));
      const { email, password } = req.body;
      let admin = await Admin.findOne({ email: email });

      if (admin != null) {
        // check given password match with DB password of particular admin OR not and return true/false
        const isMatch = await bcrypt.compare(password, admin?.password);

        if (admin.email === email && isMatch) {
          // Generate JWT Token
          const token = jwt.sign(
            { adminId: admin._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "2d" }
          );

          res.setHeader("Authorization", `Bearer ${token}`);

          //remove password field from admin object
          delete admin?.password;
          res.status(200).send({
            status: "success",
            message: "Login Success",
            token: token,
            data: admin,
          });
        } else {
          res.status(400).json({
            status: "fail",
            error: "Email or password is not Valid",
          });
        }
      } else {
        res.status(400).json({
          status: "fail",
          error: "Email or password is not Valid",
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

  // Single Login endpoint controller for all users (admin, customer, seller)
  loginUser: async (req, res) => {
    try {
      const userData = req.body;

      userData &&
        (await userAuthSchema.validate(userData, {
          abortEarly: false,
        }));

      const { email, password } = req.body;

      let customer = await Customer.findOne({ email: email });

      if (customer != null) {
        // check given password match with DB password of particular customer OR not and return true/false
        const isMatch = await bcrypt.compare(password, customer?.password);

        if (customer.email === email && isMatch) {
          if (customer.status === "active") {
            // Generate JWT Token
            const token = jwt.sign(
              { customerId: customer._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "2d" }
            );

            res.setHeader("Authorization", `Bearer ${token}`);

            //remove password field from customer object
            delete customer?.password;

            res.status(200).send({
              status: "success",
              message: "Login Successfully",
              data: {
                customer: customer,
                token: token,
                userType: "customer",
              },
            });
          } else {
            res.status(400).send({
              status: "fail",
              error: "Access Denied by Admin",
            });
            console.log("Customer Access Denied by Admin");
          }
        } else {
          res.status(400).json({
            status: "fail",
            error: "Email or password is not Valid",
          });
        }
      } else {
        let admin = await Admin.findOne({ email: email });

        if (admin != null) {
          // check given password match with DB password of particular admin OR not and return true/false
          const isMatch = await bcrypt.compare(password, admin?.password);

          if (admin.email === email && isMatch) {
            // Generate JWT Token
            const token = jwt.sign(
              { adminId: admin._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "2d" }
            );

            res.setHeader("Authorization", `Bearer ${token}`);

            //remove password field from admin object
            delete admin?.password;
            res.status(200).send({
              status: "success",
              message: "Login Successfully",
              data: {
                admin: admin,
                token: token,
                userType: "admin",
              },
            });
          } else {
            res.status(400).json({
              status: "fail",
              error: "Email or password is not Valid",
            });
          }
        } else {
          let seller = await Seller.findOne({ email: email });

          if (seller != null) {
            // check given password match with DB password of particular seller OR not and return true/false

            const isMatch = await bcrypt.compare(password, seller?.password);

            if (seller.email === email && isMatch) {
              if (seller.status === "active") {
                // Generate JWT Token
                const token = jwt.sign(
                  { sellerId: seller._id },
                  process.env.JWT_SECRET_KEY,
                  { expiresIn: "2d" }
                );

                res.setHeader("Authorization", `Bearer ${token}`);

                //remove password field from seller object
                delete seller?.password;

                res.status(200).send({
                  status: "success",
                  message: "Login Successfully",
                  data: {
                    seller: seller,
                    token: token,
                    userType: "seller",
                  },
                });
              } else {
                res.status(400).send({
                  status: "fail",
                  error: "Access Denied by Admin",
                });
                console.log("Seller Access Denied by Admin");
              }
            } else {
              res.status(400).json({
                status: "fail",
                error: "Email or password is not Valid",
              });
            }
          } else {
            res.status(400).json({
              status: "fail",
              error: "Email or password is not Valid",
            });
          }
        }
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
};
