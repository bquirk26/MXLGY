var express = require('express');
var router = express.Router();
const { pgp, db, getAllRecipes, saveRecipe, getAllSavedRecipes, unsaveRecipe, getIngredientsInRecipe, orderByCloseness } = require('../db');

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

router.get('/get_all_recipes', async function (req, res, next) {
    const userid = req.query.userid;
    const savedOnly = req.query.savedOnly;

    let recipes = await getAllRecipes(userid, savedOnly);

    recipes = recipes.map(async (recipe) => {
        const ingredients = await getIngredientsInRecipe(recipe.recipename, userid);

        return {
            ...recipe,
            ingredients
        };
    });

    recipes = await Promise.all(recipes);

    res.json(recipes);
});

router.get('/byCloseness', function (req, res, next) {
    const userid = req.query.userid;
    orderByCloseness(userid, req.query.savedOnly).then(data => {
        res.json({ recipes: data });
    }).catch(error => res.json({ error: error }));
})




// get a single recipe. TODO: make name query param optional, and render json with field for owned if param is used
//TODO show missing ingredients/ mark whether or not ingredients are owned
router.get('/:recipe', async function (req, res, next) {
    const userid = req.query.userid;
    if (userid === undefined) {
        res.sendStatus(400);
        return;
    }

    const recipeName = encodeURIComponent(req.params.recipe);

    const ingredients = await getIngredientsInRecipe(recipeName, userid);
    res.json({ ingredients });
});

//mark saved
router.post('/:recipe/save', function (req, res, next) {
    const userid = req.query.userid;
    saveRecipe(userid, req.params.recipe);
    res.sendStatus(200);
});

//unsave
router.post('/:recipe/unsave', function (req, res, next) {
    const userid = req.query.userid;
    unsaveRecipe(userid, req.params.recipe);
    res.sendStatus(200);
})

module.exports = router;
