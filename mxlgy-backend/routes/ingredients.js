var express = require('express');
var router = express.Router();
const {pgp, db, getAllOwnedIngredients, getAllIngredients, ownIngredient, disownIngredient} = require('../db');

router.get('/get_all_ingredients', function(req, res, next) {
    const name = req.query.user;
    db.any('SELECT email FROM users WHERE name = $1', [name]).then((data) => {
            const email = data[0].email;
            Promise.all([getAllOwnedIngredients(email), getAllIngredients()]).then((values) => {
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

//mark owned
router.post('/:ingredient/own', function(req, res, next) {
    const name = req.query.user;
    db.any('SELECT email FROM users WHERE name = $1', [name]).then((data) => {
        const email = data[0].email;
        ownIngredient(email, req.params.ingredient).then( () =>
            res.redirect(`/api/ingredients/get_all_ingredients?user=${name}`)).catch((error) => {
            res.render("error", {error: error});
        });
    }).catch(error => res.render("error", {error: error}));
});

//unsave
router.post('/:ingredient/disown', function(req, res, next) {
    const name = req.query.user;
    db.any('SELECT email FROM users WHERE name = $1', [name]).then((data) => {
        const email = data[0].email;
        disownIngredient(email, req.params.ingredient).then(() => {
            res.redirect(`/api/ingredients/get_all_ingredients?user=${name}`)
        }).catch((error) => {
            res.render("error", {error: error});
        })
    }).catch(error => res.render("error", {error: error}))});

module.exports = router;