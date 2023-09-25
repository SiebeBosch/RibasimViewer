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
{ "type": "Feature", "properties": { "ID": "2"},"geometry": {"type": "MultiLineString", "coordinates": [ [ [ 6.07570905817543, 53.1148002992694 ],[ 6.07720245015315, 53.1147917056428 ] ] ] } },
{ "type": "Feature", "properties": { "ID": "3"},"geometry": {"type": "MultiLineString", "coordinates": [ [ [ 6.07720245015315, 53.1147917056428 ],[ 6.07869584145192, 53.1147830934024 ] ] ] } },
{ "type": "Feature", "properties": { "ID": "4"},"geometry": {"type": "MultiLineString", "coordinates": [ [ [ 6.07869584145192, 53.1147830934024 ],[ 6.0786959847453, 53.114792078705 ] ] ] } },
{ "type": "Feature", "properties": { "ID": "5"},"geometry": {"type": "MultiLineString", "coordinates": [ [ [ 6.07869584145192, 53.1147830934024 ],[ 6.08018923207026, 53.1147744625481 ] ] ] } },
{ "type": "Feature", "properties": { "ID": "6"},"geometry": {"type": "MultiLineString", "coordinates": [ [ [ 6.0786959847453, 53.114792078705 ],[ 6.07869612803875, 53.1148010640076 ] ] ] } },
{ "type": "Feature", "properties": { "ID": "7"},"geometry": {"type": "MultiLineString", "coordinates": [ [ [ 6.07869612803875, 53.1148010640076 ],[ 6.08020359267999, 53.1156729924539 ] ] ] } },
{ "type": "Feature", "properties": { "ID": "8"},"geometry": {"type": "MultiLineString", "coordinates": [ [ [ 6.08018923207026, 53.1147744625481 ],[ 6.08168262200671, 53.1147658130799 ] ] ] } },
{ "type": "Feature", "properties": { "ID": "9"},"geometry": {"type": "MultiLineString", "coordinates": [ [ [ 6.08020359267999, 53.1156729924539 ],[ 6.08168262200671, 53.1147658130799 ] ] ] } },
{ "type": "Feature", "properties": { "ID": "10"},"geometry": {"type": "MultiLineString", "coordinates": [ [ [ 6.08168262200671, 53.1147658130799 ],[ 6.0831760112598, 53.1147571449978 ] ] ] } },
{ "type": "Feature", "properties": { "ID": "11"},"geometry": {"type": "MultiLineString", "coordinates": [ [ [ 6.07723104831236, 53.1165887661115 ],[ 6.07721674889326, 53.1156902360054 ] ] ] } },
{ "type": "Feature", "properties": { "ID": "12"},"geometry": {"type": "MultiLineString", "coordinates": [ [ [ 6.07721674889326, 53.1156902360054 ],[ 6.07720245015315, 53.1147917056428 ] ] ] } },
{ "type": "Feature", "properties": { "ID": "13"},"geometry": {"type": "MultiLineString", "coordinates": [ [ [ 6.07869584145192, 53.1147830934024 ],[ 6.0786815124574, 53.1138845630115 ] ] ] } },
{ "type": "Feature", "properties": { "ID": "14"},"geometry": {"type": "MultiLineString", "coordinates": [ [ [ 6.0786815124574, 53.1138845630115 ],[ 6.07866718414325, 53.1129860323643 ] ] ] } },
{ "type": "Feature", "properties": { "ID": "15"},"geometry": {"type": "MultiLineString", "coordinates": [ [ [ 6.0787388325182, 53.1174786830362 ],[ 6.07869612803875, 53.1148010640076 ] ] ] } },
{ "type": "Feature", "properties": { "ID": "16"},"geometry": {"type": "MultiLineString", "coordinates": [ [ [ 6.07422990239051, 53.1157074050993 ],[ 6.07421566552022, 53.114808874282 ] ] ] } },
{ "type": "Feature", "properties": { "ID": "17"},"geometry": {"type": "MultiLineString", "coordinates": [ [ [ 6.0831760112598, 53.1147571449978 ],[ 6.08319043373897, 53.1156556744451 ] ] ] } }
]
}

Here "Reaches" is a Javascript variable, to which a GeoJSON object is assigned, representing the reaches. 
By importing reaches.js in the index.html file we get access to the model's topology inside the application.


