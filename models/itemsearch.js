const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');


// Find Item Data
const ItemListcheckSchema = new Schema({}, { strict: false,versionKey: false });
const ItemList = mongoose.model('ItemList', ItemListcheckSchema,'csq_items');

// Find Seller Data
const SellerListcheckSchema = new Schema({}, { strict: false,versionKey: false });
const SellerList = mongoose.model('SellerList', SellerListcheckSchema,'csq_sellers');

// Find Buyer Wise Seller Data
const BuyerwiseSellerListcheckSchema = new Schema({}, { strict: false,versionKey: false });
const BuyerwiseSellerList = mongoose.model('BuyerwiseSellerList', BuyerwiseSellerListcheckSchema,'csq_buyer_to_seller_mapping');

// Find Item Wise Seller Data
const ItemwiseSellerListcheckSchema = new Schema({}, { strict: false,versionKey: false });
const ItemwiseSellerList = mongoose.model('ItemwiseSellerList', ItemwiseSellerListcheckSchema,'csq_seller_wise_item_mapping');

const AddtoCartcheckSchema = new Schema({}, { strict: false,versionKey: false });
const AddtoCart = mongoose.model('AddtoCart', AddtoCartcheckSchema,'csq_cart_items');
module.exports = {ItemList,SellerList,BuyerwiseSellerList,ItemwiseSellerList,AddtoCart};

