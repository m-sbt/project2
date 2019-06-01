# Project 2  
The project allows the users to search for their next holiday destination and find hotels, bars and restaurants, and tourist attractions in a city of their choice.  
The live website can be found [here](https://m-sbt.github.io/project2/).
  
---
The website uses the Google Maps API to find a city and provide the results of the search. Initially the map displays entire Europe, but when a country is selected, then the map zooms in on that country and city searches are limited only to that particular country. If no country is selected or 'All' is selected from the dropdown menu, then the searches may return cities from the entire world.  
After selecting a city the map will zoom in on that city and the markers of a desired place type (which can be changed by clicking on any of the filters) will be displayed both on the map and the results table.  
Clicking on a marker, either on a map or in results table, will provide more information about the place (address, telephone, rating and website).  

## Technologies Used
* HTML
* CSS
  * Bootstrap 4.3.1: grid and responsive design
* Javascript
  * Google Maps API
* Google Fonts: Roboto, Montserrat
* Font Awesome icons
## Features Left to Implement
* use `fitBounds()` to calculate the country zoom level automatically
* customize the map markers for different place types
* results pagination (more results)

## Testing
Manual testing has been performed in order to ensure everything works as intended (input fields, search results, buttons, links, responsiveness). The website was tested on different web browsers (Firefox, Chrome, Opera) on desktop and mobile devices. 
The following websites were used to validate the code:  
1. HTML: https://validator.w3.org/
2. CSS: https://jigsaw.w3.org/css-validator/
3. JS: https://jshint.com/  
  
There were some issues I've encountered as I wasn't yet aware of the limitations of Google Maps API. I tried to limit the city search functionality only to European countries, only to find out that the `ComponentRestrictions` interface accepts only up to 5 country code strings. [link](https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#ComponentRestrictions)  
The other limitation is up to 20 results per query, which can be increased to max 60 results with [Pagination](https://developers.google.com/maps/documentation/javascript/examples/place-search-pagination). [link](https://developers.google.com/maps/documentation/javascript/places#place_search_responses)

## Deployment
The website was deployed on GitHub pages from the master branch.  
To run the code locally [download](https://github.com/m-sbt/project2/archive/master.zip) the project, unzip it and open the `index.html` file.  
Or paste the following code into terminal to clone the repository: `git clone https://github.com/m-sbt/project2.git`
