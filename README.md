# Data Representation Project

This repository contains Brian Doheny's submission for the Data Representation 2021 module at Galway-Mayo Institute of Technology.


## What is it?

The theme of this project is a simple web app that allows everyone to view the products available in the store, although logged in users have access to more features such as creating, editing, and deleting products, customers, and even orders. You can see the app in action at https://otherbrian.pythonanywhere.com/.

The app is built with Flask Python library, and the various html pages use AJAX to interact with the main Flask app via API calls. The products and customers data are both held on MySQL databases which were created by myself with dummy data (as you'll no doubt notice). The orders data is created and received from Shopify's Draft Orders API on a dummy store that I have created especially for this project. 

** Note: This means that a secret API key is required in order for this app to fully work. If you are looking to clone this repository and have it run locally, then create a new Shopify store and edit the URLs in the Orders section of app.py. For the purposes of marking this assignment, I will be providing my teacher with this API key so that they themselves can confirm functionality.

## Repository Contents

### app.py
This is the main program which contains the Flask server. All of the other Python files within this repository feed into this program.

### CustomersDAO.py, ProductsDAO.py & UsersDAO.py
These three python files use mysql.connector to connect to the MySQL database tables that store their respective information. 

### dbconfigtemplate.py
If you are looking to run this app locally on your device, then you make a copy of this file and rename it to "dbconfig.py". Here you can enter the host, username, password and database name that you have set for your database on your local machine, and thus allow three DAO files above to work locally.

### requirements.txt
Contains the Python libraries necessary to run this app. This can be used within a virtual environment, and thus ensure whatever other versions of these libraries you currently have are not affected. You can find out more about virtual environments in Python and how to load a requirements.txt from [this blog post](https://towardsdatascience.com/virtual-environments-for-absolute-beginners-what-is-it-and-how-to-create-one-examples-a48da8982d4b).

### database
Simply contains the coffeedb MySQL database which the three DAO.py files above interact with. You can find guides on how to do this [in this article](https://hackthestuff.com/article/how-to-import-an-sql-file-in-mysql), and it covers various methods for doing this.

### staticpages folder
This folder contains all of the html files for the various pages on the app, as well as the CSS (style.css) and Javascript (scripts.js) needed to style and power their functionality.

### images
Hold the .png images used within the app. These images were created by me (Brian Doheny) via the fantastic [Excalidraw](https://excalidraw.com/) tool.

## How to clone this repository

A reminder, that you can actually see this app's functionality at https://otherbrian.pythonanywhere.com/. 

You can clone the repository to your local device by clicking the green "Code" button found in the top right section of the screen. Here you'll be given multiple options on how you wish to clone the repository. You can find details on each of these options in [GitHub's documentation](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).

![Code button in Github Repository](https://screenshot.click/15_59-dp14g-bltmz.jpg)

Once the repository is cloned, you can navigate to the folder it was saved to via your command line by using the "cd" command (Change Directory). For example:

```cd ../college/data-representation-project```

Before using the app locally, you'll first need to import the MySQL database in the Database folder. If you haven't yet installed MySQL, you can find more information on the installation on the pMySQL website](https://dev.mysql.com/doc/mysql-installation-excerpt/5.7/en/). You can find steps on how to import a MySQL database [via this article](https://hackthestuff.com/article/how-to-import-an-sql-file-in-mysql).

With the MySQL installed and the database imported, you'll next need to make a copy of dbconfigtemplate.py, and call it dbconfig.py (make sure it's spelt correctly). You'll then need to fill in the host, username, password and database name that you used when importing the database. 

After this, you will need to set up a virtual environment. This will allow you to ensure you have all of the required versions of the various libraries used in this app. You can find out more about virtual environments, why they are used, and how to set them up via [this blog post](https://towardsdatascience.com/virtual-environments-for-absolute-beginners-what-is-it-and-how-to-create-one-examples-a48da8982d4b).

Finally, as this app uses a secret API key for a dummy Shopify store that must be kept secret, it will not work in its current state unless I either provide you with that key, or you create your own Shopify store and private app. If I have provided you with the API key, then simply create a file named code.py, and save the API key to a variable within that file named "code".

If I haven't provided the API key, then you'll need to create your own Shopify store. You'll then be able to create a private app for that store. You can then follow the step above, creating a file named code.py with the API key saved to a variable named "code" within that file. You'll also have to go into app.py and update the Shopify URLs around lines 280-350 so that the calls are being made to your Shopify store, not mine.  You can find more information on Shopify private apps on [their help center](https://help.shopify.com/en/manual/apps/private-apps).