
#Budget App

##The Personal Budget Tracker is a full-stack web application designed to help individuals manage their personal finances. It allows users monitor their income, expenses, and savings. Built with Node.js, Express, Mongoose, EJS, and CSS, this project adheres to the MVC architectural pattern and is designed with a focus on user-friendly experiences and responsive design.


## Installation
Clone repository
Install dependancies (npm init)
set up .env
start application
run on localhost:3000



## Usage

Getting Started
Creating an Account

Navigate to the homepage of the Personal Budget Tracker.
Click on the "Sign Up" button.
Fill in the registration form with your username, email, and password.
Submit the form to create your account. You will be automatically logged in and redirected to the dashboard.
Logging In

If you already have an account, click on the "Login" button from the homepage.
Enter your email and password, and then click "Log In" to access your dashboard.
Managing Transactions
Adding a New Transaction

From the dashboard, click on the "Income", "Savings", or "Expenses" button or navigate to the Transactions pages.
Fill in the details of the transaction, including the type (income or expense), amount, category, date, and an optional description.
Submit the form to save the transaction. It will now appear in your transaction list and be reflected in your budget summary.
Viewing Transactions

Access the Transactions page from the navigation menu to view a list of all your transactions.
Use the filters provided (e.g., date range, type, category) to narrow down the transactions displayed.
Editing or Deleting Transactions

Find the transaction you wish to modify in the transaction list.
Click the "Edit" button next to the transaction to update any details. Save changes to update the transaction.
To delete a transaction, click the "Delete" button next to the relevant transaction and confirm the deletion.







Trello Link
https://trello.com/invite/b/hySaXwMF/ATTI23e1f8174af30978fb9b3b1e1b5ad65828029510/budget-app


Lucid Link
https://lucid.app/lucidchart/c7252b65-9eba-4101-9f45-0435b4e0b35c/edit?viewport_loc=2334%2C-2186%2C1668%2C1489%2C0_0&invitationId=inv_0c3b03f8-cdd8-4cad-adc7-d77a73af1232


Wire Frames 
https://docs.google.com/presentation/d/1q5UiSH57WUP27Z48qD4ijyEX0fnf__prRzAOotFRhbM/edit?usp=sharing










# Budget-Application
Personal Budget App


ChatGPT
Certainly! Below is a sample section for your README that discusses the technologies used in your budget app. Feel free to adjust it according to your specific implementation details or any additional technologies you might have incorporated.

Technologies Used

This budget tracking application is built with a range of technologies that enable its full-stack capabilities, from user authentication to real-time data manipulation and storage. Here's an overview of the primary technologies and tools used in the development of this application:

Node.js: A JavaScript runtime built on Chrome's V8 JavaScript engine, used for creating the server-side application. Node.js allows for executing JavaScript code outside of a browser, making it ideal for building scalable and fast network applications.
Express.js: A web application framework for Node.js, designed for building web applications and APIs. It simplifies the server creation process by providing a robust set of features for web and mobile applications. In this project, Express.js is used to handle HTTP requests, routing, and middleware integration.
MongoDB: A NoSQL database known for its flexibility and scalability. It stores data in flexible, JSON-like documents, meaning data structure can change over time. This application uses MongoDB to store user and transaction data, leveraging its powerful querying and aggregation features for managing financial records.
Mongoose: An Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a straightforward, schema-based solution to model application data. It includes built-in type casting, validation, query building, and business logic hooks. Mongoose is used in this project to model and manage application data efficiently.
EJS (Embedded JavaScript templates): A templating engine used to generate HTML markup with plain JavaScript. EJS simplifies the creation of dynamic server-side page content by embedding JavaScript directly into HTML templates. This project uses EJS to render views based on server-side logic and data.
bcrypt.js: A library to help hash passwords. In this application, bcrypt.js is used to securely store user passwords. Before saving a user's password to the database, it is hashed to ensure security and privacy.
express-session: A middleware for Express.js that enables session management. It stores session data on the server and allows the application to maintain state across requests. This project uses express-session to handle user authentication and session management, ensuring that users can interact with their personalized data securely.
CSS & Bootstrap (optional): While CSS provides the basic style definitions for the application's UI, Bootstrap (or any other CSS framework you might have used) offers a comprehensive set of styling options, responsive grid systems, and pre-designed components for enhancing the visual appeal and user experience of the application.
By leveraging these technologies, the budget tracking application offers a seamless and secure experience for managing personal finances, allowing users to add, view, edit, and delete transaction records associated with their accounts.