var express = require('express');
var router = express.Router();
const {pgp, db, getAllOwnedIngredients, getAllIngredients, ownIngredient, disownIngredient, saveRecipe} = require('../db');

router.get('/get_all_ingredients', function(req, res, next) {
    const uid = req.query.userid;
    const ownedOnly = req.query.ownedOnly;
    console.log(ownedOnly);
    getAllIngredients(uid, ownedOnly).then((data) => {
        res.json({ingredients: data})
    }).catch((error) => console.log(error));

});


//mark owned
router.post('/:ingredient/own', function(req, res, next) {
    const userid = req.query.userid;
    ownIngredient(userid, req.params.ingredient);
});

//unsave
router.post('/:ingredient/disown', function(req, res, next) {
    const userid = req.query.userid;
    disownIngredient(userid, req.params.ingredient);
});

module.exports = router;