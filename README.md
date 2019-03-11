# Luontovahdit backend

Luontovahdit is a map-based app where users can track activity in mining, prospecting, illegal dumping, and logging. Users can log in and create map hotspots and add images and/or comments when they discover relevant activity in the nature.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Node.js
npm
MongoDB
The frontend React application can be run locally independent of the back-end Express.js REST API.
The frontend client by itself can only display the map and some related features.

### Installing

Get the development back-end up and running.

Install Node modules.
```
npm install
```

Example of MongoDB connection specification in local .env file.
```
ATLAS_URI=<your mongoDB (Atlas) short SRV connection string>
PORT=3003
SECRET="<yoursecred>"
```



Start the Node Express with a MongoDB connection.
```
npm start
```

### Development roadmap

* Implement backend functionality for image CRUD operations against Cloudinary API
* Implement user position with (mobile) Leaflet
* Improve registering / logging
* Implement fix for openstreetmap randomly bugging

## Built With

* [Leaflet](https://leafletjs.com/) - an open-source JavaScript library for mobile-friendly interactive maps
* [Esri-Leaflet](https://esri.github.io/esri-leaflet/) - Middleware for using ArcGIS map services in Leaflet
* [ArcGIS](http://www.arcgis.com/home/index.html) - ArcGIS is a geographic information system (GIS) for working with maps and geographic information.
* [Express](https://rometools.github.io/rome/) - Express is a minimal and flexible Node.js web application framework.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* React-leaflet
* GTK
