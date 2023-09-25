# RibasimViewer
A universal webviewer for Deltares' Ribasim projects.
The webviewer consists solely of HTML, Javascript and CSS, thus making it extremely lightweight and portable. 
Using it is a matter of double-clicking index.html.

## Requirements
A token for Mapbox is required in order to plot the background map. This token should be implemented in config.js in the /js folder:

let MAPBOX_TOKEN = 'your_mapbox_token';

Request your own token at https://docs.mapbox.com/help/getting-started/access-tokens/

## Architecture
All RIBASIM-data, both the topology and the timeseries, is stored in the JS-folder in javascript-files. 
Inside each of these files a javascript-variable is defined and a JSON object is assigned to the variable.
This approach makes it possible to import JSON data directly from the folder into the viewer.

For example reaches.js could look like this:

let Reaches = 
{
"type": "FeatureCollection", 
"name" :  "reachesverdict",
"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
"features" :  [
{ "type": "Feature", "properties": { "ID": "1"},"geometry": {"type": "MultiLineString", "coordinates": [ [ [ 6.07421566552022, 53.114808874282 ],[ 6.07570905817543, 53.1148002992694 ] ] ] } },
{ "type": "Feature", "properties": { "ID": "2"},"geometry": {"type": "MultiLineString", "coordinates": [ [ [ 6.07570905817543, 53.1148002992694 ],[ 6.07720245015315, 53.1147917056428 ] ] ] } }
]
}

Here "Reaches" is a Javascript variable, to which a GeoJSON object is assigned, representing the reaches. 
By importing reaches.js in the index.html file we get access to the model's topology inside the application.


