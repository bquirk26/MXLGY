const pgp = require('pg-promise')();
const connect = 'postgresql://localhost/beckettquirk'
const db = pgp(connect);
db.connect().then(obj => {
    console.log(obj.client.serverVersion);
    obj.done();
}).catch(error => {
    console.log("ERROR: ", error.message || error);
})
/** 
db.any('SELECT * from ingredients')
    .then((data) => { //array of rows
        console.log(data);
        console.log(typeof(data[0]));
    })
    .catch((error) => {
        console.log("ERROR");
    });
*/

//get all recipes, ingredients.users

function getAllRecipes() {
    const data =  db.any('SELECT * FROM recipes');
    return data;
}

function getAllIngredients() {
    const data =  db.any('SELECT * FROM ingredients');
    return data;
}

    


//get user's recipes, ingredients

async function getAllSavedRecipes(userEmail) {
    const data = await db.any("SELECT recipes.* " + 
    "FROM users, saved, recipes " +
    "WHERE saved.Email = users.Email AND users.Email = $1 AND recipes.RecipeName = saved.RecipeName ", 
    [userEmail]);
    return data;
}

function getAllOwnedIngredients(userEmail) {
    const data = db.any("SELECT ingredients.*, owns.amount " + 
    "FROM users, owns, ingredients " +
    "WHERE owns.Email = users.Email and owns.IngredientName = ingredients.IngredientName and users.Email = $1", 
    [userEmail]);
    return data;
}

function getIngredientsInRecipe(recipe) {
    return db.any("SELECT contains.ingredientname, contains.amount FROM contains WHERE contains.recipename = $1", [recipe]);
}

//user saves recipe
function saveRecipe(email, recipe) {
    //check if exists?
    return db.any(`INSERT INTO saved (email, recipename) VALUES ($1, $2)`, [email, recipe]);
}

//unsave recipe
function unsaveRecipe(email, recipe) {
    return db.any(`DELETE FROM saved WHERE email = $1 AND recipename = $2`, [email, recipe]);
}
 
//user marks ingredient as owned

function ownIngredient(email, ingredient) {
    return db.any('INSERT INTO owns (email, ingredientname) VALUES ($1, $2)', [email, ingredient]);
}

function disownIngredient(email, ingredient) {
    return db.any('DELETE FROM owns WHERE email = $1 AND ingredientname = $2', [email, ingredient]);
}


/** 
getAllOwnedIngredients("test@icloud.com").then((data) => {
    console.log("res: ");
    console.log(data);
}).catch(() => {
    console.log("err");
});
*/
//all ingredients a recipe contains

db.any('SELECT name from users').then(data => console.log(data));

module.exports = {
    pgp,
    db,
    getAllOwnedIngredients,
    getAllSavedRecipes,
    getAllRecipes,
    getAllIngredients,
    getIngredientsInRecipe,
    saveRecipe,
    unsaveRecipe,
    ownIngredient,
    disownIngredient
}