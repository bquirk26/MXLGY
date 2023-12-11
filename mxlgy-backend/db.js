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

function getAllRecipes(userid, savedOnly) {
    let data;
    if (savedOnly === 'true') {
        data = db.any("WITH temp AS (SELECT recipes.*, CASE WHEN saved.userid IS NULL THEN FALSE ELSE TRUE END AS Saved " +
        "FROM recipes " + 
        "LEFT JOIN saved ON saved.recipename = recipes.recipename AND saved.userid = $1 " + 
        "ORDER BY saved DESC, recipename ASC) " +
        "SELECT * FROM temp WHERE Saved = TRUE", [userid]);
    } else {
        data =  db.any("SELECT recipes.*, CASE WHEN saved.userid IS NULL THEN FALSE ELSE TRUE END AS Saved " +
        "FROM recipes " + 
        "LEFT JOIN saved ON saved.recipename = recipes.recipename AND saved.userid = $1 " + 
        "ORDER BY saved DESC, recipename ASC", [userid]);
    }

    return data;
}

function getAllIngredients(userid, ownedOnly) {
    let data;
    if (ownedOnly === 'true') {
        data = db.any("WITH temp AS (SELECT ingredients.*, CASE WHEN owns.userid IS NULL THEN FALSE ELSE TRUE END AS Owned " +
        "FROM ingredients " + 
        "LEFT JOIN owns ON owns.ingredientname = ingredients.ingredientname AND owns.userid = $1 " +
        "ORDER BY ingredientname ASC) " +
        "SELECT * FROM TEMP WHERE Owned = true", [userid]);
    } else {
        data =  db.any("SELECT ingredients.*, CASE WHEN owns.userid IS NULL THEN FALSE ELSE TRUE END AS Owned " +
        "FROM ingredients " + 
        "LEFT JOIN owns ON owns.ingredientname = ingredients.ingredientname AND owns.userid = $1 " +
        "ORDER BY ingredientname ASC", [userid]);
    }

    return data;
}

// orderings

// by price/ total cost
function ingredientsByPrice(userid, ownedOnly) {
    const data =  db.any("SELECT ingredients.*, CASE WHEN owns.userid IS NULL THEN FALSE ELSE TRUE END AS isSaved " +
    "FROM ingredients " + 
    "LEFT JOIN owns ON owns.ingredientname = ingredients.ingredientname AND owns.userid = $1 " +
    "ORDER BY Price ASC", [userid]);
    return data;
}

function recipesByCost(userid) {

}


//by closeness to completion: 
function orderByCloseness(userid, savedOnly) {
    let data;
    if (savedOnly === 'true') {
        data = db.any("WITH temp AS ( " +
        "SELECT contains.recipename, Count (contains.ingredientName) AS missing " + 
        "FROM contains " +
        "WHERE contains.ingredientName NOT IN (SELECT ingredientName from owns WHERE userid = $1) " +
        "GROUP BY contains.recipeName " +
        "ORDER BY Count (contains.ingredientName) ASC) " +
        "SELECT temp.recipename, recipes.*, temp.missing " +
        "FROM temp " +
        "INNER JOIN recipes ON recipes.recipename = temp.recipename " +
        "WHERE temp.recipename in (SELECT recipename from saved WHERE userid = $1) " +
        "ORDER BY temp.missing", [userid]);
    } else {
        data = db.any("WITH temp AS ( " +
        "SELECT contains.recipename, Count (contains.ingredientName) AS missing " + 
        "FROM contains " +
        "WHERE contains.ingredientName NOT IN (SELECT ingredientName from owns WHERE userid = $1) " +
        "GROUP BY contains.recipeName " +
        "ORDER BY Count (contains.ingredientName) ASC) " +
        "SELECT temp.recipename, recipes.*, temp.missing " +
        "FROM temp " +
        "INNER JOIN recipes ON recipes.recipename = temp.recipename " +
        "ORDER BY temp.missing", [userid]);
    }
    return data;
}

//get user's recipes, ingredients

async function getAllSavedRecipes(userid) {
    const data = await db.any("SELECT recipes.* " + 
    "FROM users, saved, recipes " +
    "WHERE saved.userid = users.userid AND users.userid = $1 AND recipes.RecipeName = saved.RecipeName ", 
    [userid]);
    return data;
}

function getAllOwnedIngredients(userid) {
    const data = db.any("SELECT ingredients.*, owns.amount " + 
    "FROM users, owns, ingredients " +
    "WHERE owns.userid = users.userid and owns.IngredientName = ingredients.IngredientName and users.userid = $1", 
    [userid]);
    return data;
}

function getIngredientsInRecipe(recipe) {
    return db.any("SELECT contains.ingredientname, contains.amount FROM contains WHERE contains.recipename = $1", [recipe]);
}

//user saves recipe
function saveRecipe(userid, recipe) {
    //check if exists?
    db.any("SELECT userid FROM saved WHERE userid = $1 AND recipename = $2", 
                [userid, recipe]).then((data) => {
                    if (data.length > 0) {
                        return;
                    } else {
                        return db.any(`INSERT INTO saved (userid, recipename) VALUES ($1, $2)`, [userid, recipe]);
                    }
                })


}

//unsave recipe
function unsaveRecipe(userid, recipe) {
    db.any("SELECT userid FROM saved WHERE userid = $1 AND recipename = $2", 
    [userid, recipe]).then((data) => {
        if (data.length == 0) {
            return; 
        } else {
            return db.any(`DELETE FROM saved WHERE userid = $1 AND recipename = $2`, [userid, recipe]);
        }
    });
   
}
 
//user marks ingredient as owned

function ownIngredient(userid, ingredient) {
    db.any("SELECT userid FROM owns WHERE userid = $1 AND ingredientname = $2", 
    [userid, ingredient]).then((data => {
        if (data.length > 0) {
            return;
        } else {
            return db.any('INSERT INTO owns (userid, ingredientname) VALUES ($1, $2)', [userid, ingredient]);
        }
    }));
}

function disownIngredient(userid, ingredient) {
    db.any("SELECT userid FROM owns WHERE userid = $1 AND ingredientname = $2", 
    [userid, ingredient]).then((data => {
        if (data.length == 0) {
            return;
        } else {
            return db.any('DELETE FROM owns WHERE userid = $1 AND ingredientname = $2', [userid, ingredient]);
        }
    }))
}


// create user

function create_user(uid) {
    return db.any('INSERT INTO users (userid) VALUES ($1)', [uid]);
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

//db.any('SELECT name from users').then(data => console.log(data));

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
    disownIngredient,
    create_user,
    orderByCloseness
}