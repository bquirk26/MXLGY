const { db } = require('./db');
const data = require('./parsed_drinks.json');

async function add_ingredients(ingredientNames) {
    ingredientNames.forEach(async (ingredientName) => {
        await db.any('INSERT INTO ingredients (ingredientname, price) VALUES ($1, $2)', [ingredientName, Math.round(Math.random() * 4 + 15)]);
    });
}

async function add_drinks(drinks) {
    drinks.forEach(async (drink) => {
        await db.any('INSERT INTO recipes (recipename, category, image, glass, instructions) VALUES ($1, $2, $3, $4, $5)', [drink.name, drink.category, drink.image, drink.glass, drink.instructions]);
        
        for (let i = 0; i < drink.ingredients.length; i++) {
            await db.any('INSERT INTO contains (recipename, ingredientname, amount) VALUES ($1, $2, $3)', [drink.name, drink.ingredients[i], drink.measurements[i] ?? ""]);
        }

    });
}

add_ingredients(data.ingredients);
add_drinks(data.drinks);
