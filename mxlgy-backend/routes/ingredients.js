var express = require('express');
var router = express.Router();
const { pgp, db, getAllOwnedIngredients, getAllIngredients, ownIngredient, disownIngredient, saveRecipe, ingredientsByAlpha, ingredientsByOwned, ingredientsByPrice, isOwned } = require('../db');

router.get('/get_all_ingredients', function (req, res, next) {
    const userid = req.query.userid;
    const ownedOnly = req.query.ownedOnly;
    console.log(ownedOnly);
    getAllIngredients(userid, ownedOnly).then((data) => {
        res.json({ ingredients: data })
    }).catch((error) => console.log(error));

});

router.get('/get', async function (req, res) {
    const userid = req.query.userid;
    const order = req.query.order;

    console.log(order)
    console.log(userid)

    switch (order) {
        case 'price': {
            const ingredients = await ingredientsByPrice(userid);
            res.json({ ingredients });
            break;
        }
        case 'alpha': {
            const ingredients = await ingredientsByAlpha(userid);
            res.json({ ingredients });
            break;
        }
        case 'owned': {
            const ingredients = await ingredientsByOwned(userid);
            res.json({ ingredients });
            break;
        }
        default: {
            res.status(500);
            break;
        }
    }
});


//mark owned
router.get('/:ingredient/own', async function (req, res, next) {
    const userid = req.query.userid;
    if (userid === undefined) {
        res.sendStatus(400);
        return;
    }

    const ingredientName = decodeURIComponent(req.params.ingredient);

    try {
        await ownIngredient(userid, ingredientName);
        res.sendStatus(200);
        return;
    } catch (error) {
        res.sendStatus(500);
        return;
    }
});

//unsave
router.get('/:ingredient/disown', async function (req, res, next) {
    const userid = req.query.userid;
    if (userid === undefined) {
        res.sendStatus(400);
        return;
    }

    const ingredientName = decodeURIComponent(req.params.ingredient);

    try {
        await disownIngredient(userid, ingredientName);
        res.sendStatus(200);
        return;
    } catch (error) {
        res.sendStatus(500);
        return;
    }
});

//owned
router.get('/:ingredient/owned', async function (req, res, next) {
    const userid = req.query.userid;
    if (userid === undefined) {
        res.sendStatus(400);
        return;
    }

    const ingredientName = decodeURIComponent(req.params.ingredient);

    try {
        const owned = await isOwned(userid, ingredientName);
        res.send(owned ? 'true' : 'false');
        return;
    } catch (error) {
        res.sendStatus(500);
        return;
    }
});

module.exports = router;