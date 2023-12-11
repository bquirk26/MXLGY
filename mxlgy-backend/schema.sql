DROP TABLE IF EXISTS users, ingredients, recipes, owns, saved, contains;

CREATE TABLE users (
	UserId VARCHAR(200) PRIMARY KEY
);

CREATE TABLE ingredients (
	IngredientName VARCHAR(100) PRIMARY KEY,
	Price REAL
);

CREATE TABLE recipes (
	RecipeName VARCHAR(100) PRIMARY KEY,
	Category VARCHAR(100),
	Image VARCHAR(500),
	Glass VARCHAR(100),
	Instructions VARCHAR(10000)
);

CREATE TABLE owns (
	UserId VARCHAR(100),
	IngredientName VARCHAR(100),
	Amount VARCHAR(200),
	PRIMARY KEY (UserId, IngredientName), 
	FOREIGN KEY (UserId) REFERENCES users(UserId),
	FOREIGN KEY (IngredientName) REFERENCES ingredients(IngredientName)
);

CREATE TABLE saved (
	UserId VARCHAR(100),
	RecipeName VARCHAR(100),
	OnDate TIMESTAMP,
	PRIMARY KEY (UserId, RecipeName),
	FOREIGN KEY (UserId) REFERENCES users(UserId),
	FOREIGN KEY (RecipeName) REFERENCES recipes(RecipeName)
);
	
CREATE TABLE contains (
	RecipeName VARCHAR(100),
	IngredientName VARCHAR(100),
	Amount VARCHAR(200),
	PRIMARY KEY (RecipeName, IngredientName, Amount),
	FOREIGN KEY (RecipeName) REFERENCES recipes(RecipeName),
	FOREIGN KEY (IngredientName) REFERENCES ingredients(IngredientName)
);
