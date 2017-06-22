var fs = require("fs");
var _ = require("underscore");
// var d3 = require("underscore");

file = fs.readFileSync("archive-data/2017-06-15.json");
file = JSON.parse(file);

var tripids =[]

_.each(file, function(f,key){
	tripids.push(key.split(" ")[0])
})
tripids = _.unique(tripids)
// console.log(tripids)
tripids = _.groupBy(tripids, function(d) {
	return d.split("_")[1];
})
_.each(tripids, function(t, key){
	console.log(key, ": ", t.length)
})