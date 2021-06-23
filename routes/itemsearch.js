var express = require('express');
var router = express.Router();

var itemsearch_controller = require('../controllers/itemsearch');


router.get('/test', itemsearch_controller.test);
//Route of item list
router.post('/single_search', itemsearch_controller.singleSearchList);
router.post('/multiple_search', itemsearch_controller.multipleSearchList);
router.post('/item_details', itemsearch_controller.itemDetails);
router.post('/view_search', itemsearch_controller.searchByTerms);
router.post('/add_cart', itemsearch_controller.addtoCartItems);

module.exports = router;

