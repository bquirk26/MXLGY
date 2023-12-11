var express = require('express');
var router = express.Router();
const {pgp, db, getAllRecipes, saveRecipe, getAllSavedRecipes, unsaveRecipe, getIngredientsInRecipe, orderByCloseness} = require('../db');

/** 
router.get('/', function(req, res, next) {
    getAllRecipes().then((data) => {
        res.render("recipes", {data: data, title: "All Recipes"});
    }).catch((error) => {
        res.render("error", {error: error});
    })
});
*/

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
            const uid = req.query.userid;
            const savedOnly = req.query.savedOnly;
            getAllRecipes(uid, savedOnly).then((data => {
                res.json({recipes: data});
            })).catch((error) => res.render("error", {error: error}));
});

router.get('/byCloseness', function(req, res, next) {
    const uid = req.query.userid;
    orderByCloseness(uid, req.query.savedOnly).then(data => {
        res.json({recipes: data});
    }).catch(error => res.json({error: error}));
})




// get a single recipe. TODO: make name query param optional, and render json with field for owned if param is used
//TODO show missing ingredients/ mark whether or not ingredients are owned
router.get('/:recipe', function(req, res, next) {
    const name = req.query.user;
    db.any('SELECT email FROM users WHERE name = $1', [name]).then((data) => {
                //const email = data[0].email;
                Promise.all([db.any(
                    'SELECT * FROM recipes WHERE recipeName = $1', [req.params.recipe]),
                    getIngredientsInRecipe(req.params.recipe)
                ]).then((values) => {
                    res.json({recipe: values[0], ingredients: values[1]});
                })
            }).catch((error) => {
                res.render("error", {error: error});
            })
        });

//mark saved
router.post('/:recipe/save', function(req, res, next) {
    const userid = req.query.userid;
    saveRecipe(userid, req.params.recipe);
});

//unsave
router.post('/:recipe/unsave', function(req, res, next) {
    const userid = req.query.userid;
    unsaveRecipe(userid, req.params.recipe);
})

module.exports = router;
