const fetch = require('node-fetch');
const {pgp, db} = require('./db');
const data = require('./parsed_drinks.json');
//console.log(data.ingredients);


async function add_ingredients(ingredients) {
    for (var ingredient of ingredients) {
        ingredient = ingredient.replace(" ", "_");
        console.log(ingredient);
        const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?i=${ingredient}`);
        const data = await response.json();
        // db
        await db.any(`INSERT INTO ingredients (ingredientname, description, type, abv) ` + 
        `VALUES (${ingredient.replace("_", " ")}, ${data.strDescription}, ${data.strType}, ${data.strABV})`); 
    }
}

add_ingredients(data.ingredients);



//synchronicity?
async function add_drink(drink) {
    //add ingredients first


    //promise chain
    db.any("INSERT INTO recipes (recipename, category, image, glass, instructions) " + 
    "VALUES ($1, $2, $3, $4, $5)", [drink.name, drink.category, drink.image, drink.glass, drink.instructions]);
    for (let i = 0; i < drink.ingredients.length(); i++) {
        db.any("INSERT INTO contains (recipename, ingredientname, amount) " + 
        "VALUES ($1, $2, $3)", [drink.name, drink.ingredients[i]], drink.measurements[i]);
    }
}




