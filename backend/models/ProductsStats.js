const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductStatSchema = new mongoose.Schema(
  {
   productId: {
    type : String,
   },
   yearlySalesTotal : {
    type : Number,
   },
   yearlyTotalSoldUnits : {
    type : Number,
   },
   year : {
    type : Number,
   },
   monthlyData: [
    {
      month: String,
      totalSales: Number,
      totalUnits: Number,
    }
   ],
   dailyData : {
    date : String,
    totalSale : Number,
    totalUnits : Number,
   }
  },
  {
    timestamps: true,
  }
);


const ProductStat = mongoose.model("ProductStat", ProductStatSchema);

module.exports = ProductStat;
