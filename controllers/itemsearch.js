const {ItemList,SellerList,BuyerwiseSellerList,ItemwiseSellerList,AddtoCart} = require('../models/itemsearch');
var appData = {
    "status" : 0,
    "message" : "",
    "data" : []
}
var moment = require('moment');
var _time = moment().format('DD-MM-YYYY HH:mm:ss');

exports.test = function (req, res) {

     res.send("Controller is working fine");
};

//Controller of function using single list search
exports.singleSearchList = function (req, res) 
{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    var input = JSON.parse(JSON.stringify(req.body));
    if(input.searchkey)
    {
        var where={};
        if(input.process =='1')
        {
            where={$or: [ { item_name:{$regex:input.searchkey, $options: 'i'} },{ content:{$regex:input.searchkey, $options: 'i'}},{ packing_size:{$regex:input.searchkey, $options: 'i'}}]};
            // res.send('1')
        }
        if(input.process =='2')
        {
            var split_searchkey=input.searchkey.split(' ');
            whereArray=[{ item_name:{$regex:input.searchkey, $options: 'i'} },{ content:{$regex:input.searchkey, $options: 'i'}},{ packing_size:{$regex:input.searchkey, $options: 'i'}}];

            split_searchkey.forEach(function(value,index)
            {
                if(value !='')
                {
                   whereArray.push({ item_name:{$regex:value, $options: 'i'} },{ content:{$regex:value, $options: 'i'}},{ packing_size:{$regex:value, $options: 'i'}}) 
                }
            });
            where ={$or: whereArray};
            // res.send(where)
        }
        ItemList.find(where,function(error, response){
            if(error)
            {
              appData["status"] = 0
              appData["message"] = "Internal Server Error"
              appData["data"] = []
              res.send(appData)
            }
            else
            {
                // res.send(response);
                if(response !='' && response !=null)
                {
                  var itemdetail = JSON.parse(JSON.stringify(response));
                  appData["status"] = 1
                  appData["message"] = "Success"
                  appData["data"] = itemdetail
                  res.send(appData)
                }
                else
                {
                  appData["status"] = 0
                  appData["message"] = "Not Found"
                  appData["data"] = []
                  res.send(appData)
                }
            }
        });
    }
    else
    {
      appData["status"] = 0
      appData["message"] = "All field is required"
      appData["data"] = []
      res.send(appData)
    }   
};
function relatedContentItems(content,itemdetail,cb)
{
    var contentchar_replace=content.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    var item_codes=[]
    itemdetail.forEach(function(value,index){
        if(value.item_code !='')
        {
             item_codes.push(Number(value.item_code));   
        }
    })
    var item_detailsplit=itemdetail[0]['item_name'].split(' ');
    var firstarray=item_detailsplit[0];
    var where={item_code: { $nin: item_codes },content:content};
    ItemList.find(where,function(error, response){
      if(response !='' && response !=null)
        {
            var relateitem = JSON.parse(JSON.stringify(response));
            cb(relateitem);
        }
        else
        {
            cb(null);
        }
    });
}
exports. searchByTerms= function (req, res) 
{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    var input = JSON.parse(JSON.stringify(req.body));
    if(input.item_code)
    {
        ItemList.findOne({item_code:Number(input.item_code)},function(error,response){
            if(error)
            {
              appData["status"] = 0
              appData["message"] = "Internal Server Error"
              appData["data"] = []
              res.send(appData)
            }
            else
            {
                // res.send(response);
                if(response !='' && response !=null)
                {
                  var itemdetail = JSON.parse(JSON.stringify(response));
                  var itemdetails=[itemdetail]
                  var content=itemdetail['content'];
                  relatedContentItems(content,itemdetails,function(relateditem) {
                      // res.send(relateditem)
                      if(relateditem !=null)
                      {
                          var items=[itemdetail].concat(relateditem);
                          appData["status"] = 1
                          appData["message"] = "Success"
                          appData["data"] = items
                          res.send(appData)
                      }
                      else
                      {
                          appData["status"] = 1
                          appData["message"] = "Success"
                          appData["data"] = itemdetail
                          res.send(appData)  
                      }
                  });
                }
                else
                {
                  appData["status"] = 0
                  appData["message"] = "Not Found"
                  appData["data"] = []
                  res.send(appData)
                }
            }
        });
    }
    else
    {
        res.send("all field is required")
    }
};
//Controller of function using Multiple list search
exports.multipleSearchList = function (req, res) 
{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    var input = JSON.parse(JSON.stringify(req.body));
    if(input.searchkey && input.index)
    {
        var split_searchkey=input.searchkey.split(',');
        var searchkey_index=input.index
        var where={};
        if(input.process =='1')
        {
            whereArray=[ { item_name:{$regex:split_searchkey[searchkey_index], $options: 'i'} },{ content:{$regex:split_searchkey[searchkey_index], $options: 'i'}},{ packing_size:{$regex:split_searchkey[searchkey_index], $options: 'i'}}];
            where ={$or: whereArray};
        }
        // res.send(where)
        ItemList.find(where,function(error, response){
            if(error)
            {
              appData["status"] = 0
              appData["message"] = "Internal Server Error1"
              appData["data"] = error
              res.send(appData)
            }
            else
            {
                // res.send(response);
                if(response !='' && response !=null)
                {
                  var itemdetail = JSON.parse(JSON.stringify(response));
                  var content=itemdetail[0]['content'];
                  // res.send(content)
                  // var item_code=itemdetail[0]['item_code'];
                  relatedContentItems(content,itemdetail,function(relateditem) {
                      // res.send(relateditem)
                      if(relateditem !=null)
                      {
                          var items=itemdetail.concat(relateditem);
                          appData["status"] = 1
                          appData["message"] = "Success"
                          appData["data"] = items
                          res.send(appData)
                      }
                      else
                      {
                          appData["status"] = 1
                          appData["message"] = "Success"
                          appData["data"] = itemdetail
                          res.send(appData)  
                      }
                  });
                }
                else
                {
                  appData["status"] = 0
                  appData["message"] = "Not Found"
                  appData["data"] = []
                  res.send(appData)
                }
            }
        });
    }
    else
    {
      appData["status"] = 0
      appData["message"] = "All field is required"
      appData["data"] = []
      res.send(appData)
    }
};
//Controller of function using item wise seller
function relatedItemDetails(item_name,cb)
{
    var where={$or: [ { item_name:{$regex:item_name, $options: 'i'} }]};
    ItemList.find(where,function(error, response){
        if(response !='' && response !=null)
        {
            var relateitem = JSON.parse(JSON.stringify(response));
            cb(relateitem);
        }
        else
        {
            cb(null);
        }
    });
}
function itemwiseSellerListBasedonPriority(item_code,buyer_code,callBack) 
{
    BuyerwiseSellerList.aggregate(
    [
        { $match: {buyer_code:buyer_code} },
        { $sort : { priority: 1 } },
        {
            $lookup: {
                from: "csq_seller_wise_item_mapping",
                localField: "seller_code",
                foreignField: "seller_code",
                as: "product"
            }
        },
        { "$unwind": "$product" },
        { $match: { "product.item_code":Number(item_code),"product.stock": {$ne:0} } },
        { $sort : { "product.free_qty" : -1, "product.price": 1 } },
        {
            $lookup: {
                from: "csq_sellers",
                localField: "product.seller_code",
                foreignField: "seller_code",
                as: "product1"
            }
        },
        {
            $lookup: {
                from: "csq_cart_items",
                "let": { "seller_code": "$seller_code" },
                "pipeline": [
                    { "$match": {"$expr": { "$eq": [ "$$seller_code", "$seller_code" ] },"item_code":Number(item_code),"buyer_code":buyer_code,"status": 1}},
                  ],
                as: "product2"
            }
        },
        // { "$unwind": "$product2" },
        // { $match: {"product2.status":1} },
        // { "$unwind": "$product2" },
        { 
            "$project": {
                "seller_code": { "$arrayElemAt": ["$product1.seller_code", 0] },
                "seller_name": { "$arrayElemAt": ["$product1.seller_name", 0] },
                "_id": 0,
                "seller_item_code": "$product.seller_item_code",
                "item_code": "$product.item_code",
                "price": "$product.price",
                "sales_qty": "$product.sales_qty",
                "free_qty": "$product.free_qty",
                "stock": "$product.stock",
                "cart_status": { "$arrayElemAt": ["$product2.status",0]},
                "qty": { "$arrayElemAt": ["$product2.qty",0]},
            }
        }

    ]).then(function(docs) 
    {
        // callBack(docs)
        // res.send(docs)
        var where={}
        if(docs.length >0 )
        {
            var seller_codes=[]
            docs.forEach(function(element,index) 
            {
                if(element !='')
                {
                    seller_codes.push(element.seller_code);
                }
            });
            where = {item_code:Number(item_code),stock: {$ne:0},seller_code: { $nin: seller_codes }}
        }
        else
        {
            where = {item_code:Number(item_code),stock: {$ne:0}}
        }
        // res.send(where)
        ItemwiseSellerList.aggregate(
        [
            { $match:  where},
            { $sort : { free_qty : -1, price: 1 } },
            {
            $lookup: {
                from: "csq_sellers",
                localField: "seller_code",
                foreignField: "seller_code",
                as: "product"
            }
        },
        {
            $lookup: {
                from: "csq_cart_items",
                "let": { "seller_code": "$seller_code" },
                "pipeline": [
                    { "$match": {"$expr": { "$eq": [ "$$seller_code", "$seller_code" ] },"item_code":Number(item_code),"buyer_code":buyer_code,"status": 1}},
                  ],
                as: "product1"
            }
        },
        { 
            "$project": {
                "seller_code": { "$arrayElemAt": ["$product.seller_code", 0] },
                "seller_name": { "$arrayElemAt": ["$product.seller_name", 0] },
                "_id": 0,
                "seller_item_code": 1,
                "item_code": 1,
                "price":1,
                "sales_qty": 1,
                "free_qty":1,
                "stock": 1,
                "cart_status": { "$arrayElemAt": ["$product1.status", 0] },
                "qty": { "$arrayElemAt": ["$product1.qty", 0] },
            }
        }

        ]).then(function(docs1) 
        {
            if(docs.length > 0 )
            {
                if(docs1.length > 0)
                {
                    var joinArray=docs.concat(docs1);
                    callBack(joinArray)

                }
                else{
                    callBack(docs)
                }
            }
            else
            {
                callBack(docs1)
            }
        })
    })
}
exports.itemDetails = function (req, res) 
{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    var input = JSON.parse(JSON.stringify(req.body));
    if(input.item_code && input.buyer_code)
    {
        ItemList.findOne({item_code:Number(input.item_code)},function(error,response){
            if(error)
            {
              appData["status"] = 0
              appData["message"] = "Internal Server Error"
              appData["data"] = []
              res.send(appData)
            }
            else
            {
                // res.send(response);
                if(response !='' && response !=null)
                {
                  var itemdetail = JSON.parse(JSON.stringify(response));
                  itemdetail['sellerwisedata']=[];
                  itemdetail['relateditems']=[];
                  var packing_size=itemdetail['packing_size'];
                  var item_name=itemdetail['item_name'].replace(packing_size,'');
                  itemwiseSellerListBasedonPriority(input.item_code,input.buyer_code, function(callBack) {
                      itemdetail['sellerwisedata']=callBack;

                      if(packing_size !='')
                      {
                          relatedItemDetails(item_name,function(relateditem) {
                              if(relateditem !=null)
                              {
                                  itemdetail['relateditems']=relateditem;
                                  appData["status"] = 1
                                  appData["message"] = "Success"
                                  appData["data"] = itemdetail
                                  res.send(appData)
                              }
                              else
                              {
                                
                                  appData["status"] = 1
                                  appData["message"] = "Success"
                                  appData["data"] = itemdetail
                                  res.send(appData)  
                              }
                          });
                      }
                      
                  });
                }
                else
                {
                  appData["status"] = 0
                  appData["message"] = "Not Found"
                  appData["data"] = []
                  res.send(appData)
                }
            }
        });
    }
    else
    {
      appData["status"] = 0
      appData["message"] = "All field is required"
      appData["data"] = []
      res.send(appData)
    }
};
//Controller of function using Add to card
exports.addtoCartItems = function (req, res) 
{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    var input = JSON.parse(JSON.stringify(req.body))
    if(Number(input.qty) > 0 && input.buyer_code !='' && input.item_code !='' && input.seller_code !='')
    {
        AddtoCart.findOneAndUpdate({buyer_code:input.buyer_code,item_code:Number(input.item_code),seller_code:Number(input.seller_code), status:1},{$set: {qty:Number(input.qty)}},{projection: { "_id" : 1}},function(err, product) {
            if(err)
            {
                appData["status"] = 0
                appData["message"] = "Internal Server Error"
                appData["data"] = []
                res.send(appData)
            }
            else
            {
                if(product !='' && product !=null)
                {
                    appData["status"] = 1
                    appData["message"] = "Cart Item Update successfully"
                    appData["data"] = []
                    res.send(appData)
                }
                else
                {
                    var insertdata={
                        seller_code:Number(input.seller_code),
                        buyer_code:input.buyer_code,
                        item_code:Number(input.item_code),
                        qty:Number(input.qty),
                        status:1,
                    }
                    var product = new AddtoCart(insertdata);
                    product.save(function (err1,next1) {
                        if (err1) {
                            appData["status"] = 0
                            appData["message"] = "Internal Server Error"
                            appData["data"] = []
                            res.send(appData)
                        }else{
                            appData["status"] = 1
                            appData["message"] = "Cart Item Added successfully"
                            appData["data"] = next1
                            res.send(appData)
                        }
                    })
                }
            }
        });
    }
    else
    {
        appData["status"] = 0
        appData["message"] = "Please Fill All Fields Required"
        appData["data"] = []
        res.send(appData)
    }    
};