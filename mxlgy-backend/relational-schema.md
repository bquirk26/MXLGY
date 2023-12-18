
# Relational Schema


## Entities
```sql
CREATE TABLE users (
	userid VARCHAR(200) PRIMARY KEY
);

CREATE TABLE ingredients (
	IngredientName VARCHAR(100) PRIMARY KEY,
	Description VARCHAR(7500),
	Type VARCHAR(100),
	ABV REAL,
	price REAL
);

CREATE TABLE recipes (
	RecipeName VARCHAR(100) PRIMARY KEY,
	Category VARCHAR(100),
	Image VARCHAR(500),
	Glass VARCHAR(100),
	Instructions VARCHAR(10000)
);
--view for recipes + total cost?
```


### relations 
```sql
CREATE TABLE owns (
	userid VARCHAR(200),
	IngredientName VARCHAR(100),
	Amount VARCHAR(200),
	PRIMARY KEY (userid, IngredientName), 
	FOREIGN KEY (userid) REFERENCES users(userid),
	FOREIGN KEY (IngredientName) REFERENCES ingredients(IngredientName)
);

CREATE TABLE saved (
	userid VARCHAR(200),
	RecipeName VARCHAR(100),
	OnDate TIMESTAMP,
	PRIMARY KEY (userid, RecipeName),
	FOREIGN KEY (userid) REFERENCES users(userid),
	FOREIGN KEY (RecipeName) REFERENCES recipes(RecipeName)
);
	
CREATE TABLE contains (
	RecipeName VARCHAR(100),
	IngredientName VARCHAR(100),
	Amount VARCHAR(200), --CHARs, probably
	PRIMARY KEY (RecipeName, IngredientName),
	FOREIGN KEY (RecipeName) REFERENCES recipes(RecipeName),
	FOREIGN KEY (IngredientName) REFERENCES ingredients(IngredientName)
);

```

### Queries

```sql
-- get all recipes and mark whether a given user has saved them
SELECT recipes.recipename, CASE WHEN saved.email IS NULL THEN FALSE ELSE TRUE END AS isSaved
FROM recipes
LEFT JOIN saved ON saved.recipename = recipes.recipename AND saved.email = 'test@icloud.com'

-- get all ingredients and mark whether a given user owns them
SELECT ingredients.ingredientname, CASE WHEN owns.email IS NULL THEN FALSE ELSE TRUE END AS isOwned
FROM ingredients
LEFT JOIN owns ON owns.ingredientname = ingredients.ingredientname AND owns.email = 'test@icloud.com';

-- all recipes a user can make given the ingredients they own

SELECT C1.recipeName, Count (ingredientName)
FROM contains as C1
GROUP BY recipeName
HAVING Count (C1.ingredientName) = (SELECT Count (C2.ingredientName) 
								FROM contains as C2
								INNER JOIN owns ON owns.ingredientName = C2.ingredientName
								WHERE userid = 'test@icloud.com' AND C1.recipeName = C2.recipeName
								GROUP BY C2.recipeName);

-- recipes ordered by how many of their ingredients a user is missing
SELECT contains.recipeName, Count (contains.ingredientName)
FROM contains
WHERE contains.ingredientName NOT IN (SELECT ingredientName from owns WHERE email = 'test@icloud.com')
GROUP BY contains.recipeName
ORDER BY Count (contains.ingredientName) ASC;

```