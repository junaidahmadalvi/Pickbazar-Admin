const mongoose = require("mongoose");
const yup = require("yup");
const { productModel } = require("./product.model");

// mongoose schema
const orderModel = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      default: "Order Processing",
      enum: [
        "Pending",
        "Order Processing",
        "Order At Local Facility",
        "Order Out For Delivery",
        "Order Completed",
      ],
    },
    deliveryFee: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    billingAddress: {
      country: {
        type: String,
        // required: true,
      },
      city: {
        type: String,
        // required: true,
      },
      state: {
        type: String,
        // required: true,
      },
      zip: {
        type: Number,
        // required: true,
      },
      streetAddress: {
        type: String,
        // required: true,
      },
    },
    shippingAddress: {
      country: {
        type: String,
        // required: true,
      },
      city: {
        type: String,
        // required: true,
      },
      state: {
        type: String,
        // required: true,
      },
      zip: {
        type: Number,
        // required: true,
      },
      streetAddress: {
        type: String,
        // required: true,
      },
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    // products: {
    //   type: Array,
    //   // default: [],
    // },
    items: [
      {
        item: {
          type: productModel,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: {
          type: Number,
        },
        itemTotal: {
          type: Number,
        },
      },
    ],
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer", // Reference to the "Group" model
      required: true,
    },
  },
  { timestamps: true }
);

//---------- Order Yup(validating schemas)---------

const orderYupSchema = yup.object().shape({
  status: yup
    .string()
    .default("Order Processing")
    .oneOf([
      "Pending",
      "Order Processing",
      "Order At Local Facility",
      "Order Out For Delivery",
      "Order Completed",
    ]),

  deliveryFee: yup
    .number()
    .positive("Delivery Fee must be a positive number")
    .required("Delivery fee is required"),
  totalAmount: yup
    .number()
    .positive("Total Ammout must be a positive number")
    .required("Total amount is required"),
  billingAddress: yup.object().shape({
    country: yup.string().required("Billing country is required"),
    city: yup.string().required("Billing city is required"),
    state: yup.string().required("Billing state is required"),
    zip: yup.number().required("Billing zip code is required"),
    streetAddress: yup.string().required("Billing street address is required"),
  }),
  shippingAddress: yup.object().shape({
    country: yup.string().required("Shipping country is required"),
    city: yup.string().required("Shipping city is required"),
    state: yup.string().required("Shipping state is required"),
    zip: yup.number().required("Shipping zip code is required"),
    streetAddress: yup.string().required("Shipping street address is required"),
  }),
  date: yup.date().default(() => new Date()),
  products: yup.array(),
  customerId: yup
    .string()
    .trim()
    .required("Customer ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid Customer ID format"), // Ensure it's a valid ObjectId
});

// <============create collection============>
const Order = new mongoose.model("Order", orderModel);

module.exports = {
  Order,
  orderYupSchema,
};
