
# Relational Schema

```sql
CREATE TABLE users (
	Email VARCHAR(100) PRIMARY KEY,
	Name VARCHAR(40),
	Password VARCHAR(30) NOT NULL
);

CREATE TABLE ingredients (
	IngredientName VARCHAR(100) PRIMARY KEY,
	Description VARCHAR(7500),
	Type VARCHAR(100),
	ABV REAL
);

CREATE TABLE recipes (
	RecipeName VARCHAR(100) PRIMARY KEY,
	Category VARCHAR(100),
	Image VARCHAR(500),
	Glass VARCHAR(100),
	Instructions VARCHAR(10000)
);
```


### relations 
```sql
CREATE TABLE owns (
	Email VARCHAR(100),
	IngredientName VARCHAR(100),
	Amount VARCHAR(200),
	PRIMARY KEY (Email, IngredientName), 
	FOREIGN KEY (Email) REFERENCES users(Email),
	FOREIGN KEY (IngredientName) REFERENCES ingredients(IngredientName)
);

CREATE TABLE saved (
	Email VARCHAR(100),
	RecipeName VARCHAR(100),
	OnDate TIMESTAMP,
	PRIMARY KEY (Email, RecipeName),
	FOREIGN KEY (Email) REFERENCES users(Email),
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
--all

--  get all users
--  get all recipes
--  get all ingredients
--  create ingredient, user, recipe


-- all recipes a user saved
SELECT RecipeName 
FROM users, saved, recipes 
WHERE saved.Email = users.Email and saved.RecipeName = recipes.RecipeName and user.Email = ${var}
-- all ingredients a user owns
SELECT IngredientName 
FROM users, owns, ingredients 
WHERE owns.Email = users.Email and saved.IngredientName = ingredients.IngredientName and user.Email = ${var}

-- all ingredients a recipe contains
SELECT IngredientName 
FROM users, owns, ingredients 
WHERE owns.Email = users.Email and saved.IngredientName = ingredients.IngredientName and user.Email = ${var}



```