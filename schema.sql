-- Creates the "bamazon" database --

CREATE DATABASE bamazon;

-- all of the code will affect "bamazon" --
USE bamazon;

-- Creates the table "products" within bamazon --
CREATE TABLE products (
	ItemID INTEGER(11) AUTO_INCREMENT NOT NULL,
	ProductName  VARCHAR(50) NOT NULL,
	DepartmentName VARCHAR(50) NOT NULL,
	Price DECIMAL(10,2),
	StockQuantity INTEGER(10),
	PRIMARY KEY (ItemID)
);

INSERT INTO products (ProductName,DepartmentName,Price,StockQuantity)
VALUES ("Eyeliner", "Cosmetics", 25.99, 10);
INSERT INTO products (ProductName,DepartmentName,Price,StockQuantity)
VALUES ("Lipstick", "Cosmetics", 30.00, 16);
INSERT INTO products (ProductName,DepartmentName,Price,StockQuantity)
VALUES ("Mascara", "Cosmetics", 22.00, 3);
INSERT INTO products (ProductName,DepartmentName,Price,StockQuantity)
VALUES ("Blush", "Cosmetics", 18.00, 8);
INSERT INTO products (ProductName,DepartmentName,Price,StockQuantity)
VALUES ("Serving Tray", "Kitchen", 20.95, 5);
INSERT INTO products (ProductName,DepartmentName,Price,StockQuantity)
VALUES ("Frying Pan", "Kitchen", 15.99, 1);
INSERT INTO products (ProductName,DepartmentName,Price,StockQuantity)
VALUES ("Soup Bowls", "Kitchen", 4.95, 10);
INSERT INTO products ( ProductName,DepartmentName,Price,StockQuantity)
VALUES ("Blue Shirt", "Clothes", 39.99, 3);
INSERT INTO products (ProductName,DepartmentName,Price,StockQuantity)
VALUES ("Gloves", "Clothes", 12.99, 10);
INSERT INTO products (ProductName,DepartmentName,Price,StockQuantity)
VALUES ("Grey Sweater", "Clothes", 50.99, 1);

select * FROM products;

