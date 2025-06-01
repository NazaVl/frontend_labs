This project is the result of the Front-end Development course. 
React+vite was used for the frontend server. 
For the backend, node.js is used. 
This project uses PostgreSQL to store data. 
For correct operation, you need to update the data in the .env and db.js files, except (possibly) the corresponding port values with your own.
For setup database use db_setup.js. 
This setup creates the appropriate tables and fills them with some data, namely:
1. the products table is filled with 20 products of different categories
2. the users table is filled with account data for the Administrator. You can create an administrator only by adding a new one to this table. db_setup.js contains the appropriate login details for the administrator account. These data will also be provided below:
   ADMIN_EMAIL = 'admin@mail.com';
   ADMIN_PASSWORD = 'AdminPassword';
   ADMIN_NAME = 'Admin';
The administrator can change product data, add new ones or delete existing ones.
