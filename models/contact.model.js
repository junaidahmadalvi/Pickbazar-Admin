const mongoose = require("mongoose");
const yup = require("yup");

// mongoose schema
const contactModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// <============create collection============>
const Contact = new mongoose.model("Contact", contactModel);

module.exports = { Contact };
