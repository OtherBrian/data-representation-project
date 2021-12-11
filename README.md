# Data Representation Project

This repository contains Brian Doheny's submission for the Data Representation 2021 module at Galway-Mayo Institute of Technology.

The theme of this project is a web app that simulates a simple coffee bean store and has information on the products for sale, the customers at the store, and the orders that have been created for them. Product and Customer data is hosted on a MySQL database which allows CRUD operations via AJAX calls on the webpages themselves. Meanwhile Orders are created via Shopify's draft_orders API, and their information is then served via GET requests to that same API. These are actual draft_orders on a dummy Shopify Store, and so there's no financial information or similar attached to that store.

All images used in this app were created by me via the Excalidraw tool, and can be found within the images folder of this repository. You can also find all of the html, javascript and CSS used within this app in the staticpages folder.