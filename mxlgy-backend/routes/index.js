var express = require('express');
var router = express.Router();
const {pgp, db} = require('../db');


/* GET home page. 


*/
router.get('/', async function(req, res, next) {
  //check password
  console.log(req.query.password);
  const data = await db.any('SELECT password FROM users WHERE email = $1', ["test@icloud.com"]);
  res.render("index",{title: data[0].password});
  

});

module.exports = router;


/**
 * ROUTES TODO:
 * all users
 * one user page
 * user's recipes
 * recommended purchases
 * 
 */