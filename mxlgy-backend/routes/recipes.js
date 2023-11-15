var express = require('express');
var router = express.Router();
const {pgp, db, getAllRecipes, getIngredientsInRecipe, getAllSavedRecipes} = require('../db');

router.get('/', function(req, res, next) {
    getAllRecipes().then((data) => {
        res.render("recipes", {data: data, title: "All Recipes"});
    }).catch((error) => {
        res.render("error", {error: error});
    })
});

/** 
router.get('/:recipename', function(req, res, next) {
    Promise.all([db.any('SELECT * FROM recipes where recipename = $1', 
    [req.params.recipename]), getIngredientsInRecipe(req.params.recipename)]).then((results) => {
        res.render("recipe_view", {title: req.params.recipename, ingredients: results[1], recipe: results[0]});
    }).catch((error) => {
        res.render("error", {error: error});
    })
});
*/

router.get('/get_all_recipes', function(req, res, next) {
    const name = req.query.user;
    db.any('SELECT email FROM users WHERE name = $1', [name]).then((data) => {
            const email = data[0].email;
            Promise.all([getAllSavedRecipes(email), getAllRecipes()]).then((values) => {
                if (values[0] === null) {
                    res.json({ingredients: values[1].forEach(element => element.isOwned = false)});
                    console.log('none');
                } else {
                    const all_owned_ingredients = values[0].map(obj => obj.ingredientname);
                    var ret = values[1];
                    ret.forEach(element => element.isOwned = all_owned_ingredients.includes(element.ingredientname));
                    res.json({ingredients: ret}); 
                }
                //res.json({ingredients: values[2]})

            }).catch((error) => {
                console.log(error);
            })
        });
});

module.exports = router;
