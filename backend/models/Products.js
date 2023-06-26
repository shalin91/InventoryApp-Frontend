const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      ratings: {
        type: Number,
        required: true, 
      },
      quantity: {
        type: Number,
        required: true,
        default: 0,
      },
      category: {
        type: String,
        required: true,
      },
      brand: {
        type: String,
      },
      imageURL: {
        type: String,
        
      },
      isActive: {
        type: Boolean,
        default: true,
      },  
  },
  {
    timestamps: true,
  }
);


const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
