var express = require('express');
var router = express.Router();
const { pgp, db, getAllOwnedIngredients, user_exists, getAllSavedRecipes, getAllIngredients, create_user } = require('../db');

//user register => POST / INSERT INTO

router.get('/signup', async function (req, res, next) {
    //validation
    /**
     * What should the form contain? 
     * name, email, password? -- probably not;
     * 
     */
    const userid = req.query.userid;

    if (userid === undefined) {
        res.sendStatus(400);
        return;
    }

    if (await user_exists(userid)) {
        res.sendStatus(403);
        return;
    }
    
    try {
        await create_user(userid);
        res.sendStatus(201);
        return;
    } catch {
        res.sendStatus(500);
        return;
    }
});

router.get('/exists', async function (req, res, next) {
    const userid = req.query.userid;

    if (userid == undefined) {
        res.sendStatus(400);
        return;
    }

    if (await user_exists(userid)) {
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});


module.exports = router;

