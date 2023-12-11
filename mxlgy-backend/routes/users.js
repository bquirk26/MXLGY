var express = require('express');
var router = express.Router();
const {pgp, db, getAllOwnedIngredients, getAllSavedRecipes, getAllIngredients, create_user} = require('../db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.any('SELECT Name, Email FROM USERS')
    .then((data) => { //array of rows
        res.render("users", {data: data, title: "users"});
    })
    .catch((error) => {
        console.log("ERROR");
    })
});

router.get('/:name', function(req, res, next) {
    const name = req.params.name;
    db.any('SELECT email FROM users WHERE name = $1', [name]).then((data) => {
        const email = data[0].email;
        Promise.all([getAllSavedRecipes(email), getAllOwnedIngredients(email)]).then((values) => {
            res.render("user_view", {recipes: values[0], ingredients: values[1], title: email});
        }).catch((error) => {
            console.log(error);
        })
    })
})

router.get('/api/:name', function(req, res, next) {
    const name = req.params.name;
    db.any('SELECT email FROM users WHERE name = $1', [name]).then((data) => {
        const email = data[0].email;
        Promise.all([getAllSavedRecipes(email), getAllOwnedIngredients(email), getAllIngredients()]).then((values) => {
            res.json(values[2].forEach(element => element.isOwned = values[0].contains(element))); 
        }).catch((error) => {
            console.log(error);
        })
    })

})

//user register => POST / INSERT INTO

router.post('/signup', function(req, res, next) {
    //validation
    /**
     * What should the form contain? 
     * name, email, password? -- probably not;
     * 
     */
    const id = req.query.id;
    if (id === null) {
        res.sendStatus(400);
        return;
    }
    create_user(id).then(res.sendStatus(201)).catch(res.sendStatus(400));
});

router.get('/exists', function(req, res, next) {
    const id = req.query.id;
    if (id == null) {
        res.sendStatus(400);
        return;
    }
    create_user(id).then(res.sendStatus(200)).catch(res.sendStatus(400));
});


module.exports = router;

