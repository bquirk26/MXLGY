const fetch = require('node-fetch');
const {pgp, db} = require('./db');
const data = require('./parsed_drinks.json');
//console.log(data.ingredients);





async function add_ingredients(ingredients) {
    for (var ingredient of ingredients) {
        ingredient = ingredient.replace(" ", "_");
        console.log(ingredient);
        const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?i=${ingredient}`);
        var data = await response.json();
        data = data.ingredients[0];

        // db
        await db.any(`INSERT INTO ingredients (ingredientname, description, type, abv) ` + 
        'VALUES ($1, $2, $3, $4)', [ingredient.replace("_", " "), data.strDescription, data.strType, data.strABV]); 
    }
}

function containsDuplicates(arr) {
    return arr.filter((value, index) => arr.indexOf(value) !== index).length > 0;
}

const set = new Set([]);

for (var drink of data.drinks) {
    if (containsDuplicates(drink.ingredients)) {
        set.add(drink.id);
    }
}


//synchronicity?
async function add_drinks(drinks, skipSet) {
    //add ingredients first
    //promise chain
    for (var drink of drinks) {
        if (set.has(drink.id)) {
            continue;
        }
        await db.any("INSERT INTO recipes (recipename, category, image, glass, instructions) " + 
        "VALUES ($1, $2, $3, $4, $5)", [drink.name, drink.category, drink.image, drink.glass, drink.instructions]);
        for (let i = 0; i < drink.ingredients.length; i++) {
            await db.any("INSERT INTO contains (recipename, ingredientname, amount) " + 
            "VALUES ($1, $2, $3)", [drink.name, drink.ingredients[i], drink.measurements[i]]);
        }
    }

}

add_ingredients(data.ingredients);
add_drinks(data.drinks, set);

/**
async function go() {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?i=grape_juice`);
    const data = await response.json();
    console.log(data);
}
 */

/**
db.any('SELECT * from users WHERE name = $1', ['tester'])
    .then((data) => { //array of rows
        console.log(data[0].email);
    })
    .catch((error) => {
        console.log(error.stack);
    });
 */

//go();