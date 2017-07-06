var _ = require("underscore");
var fs = require("fs");
var glob = require("glob");


// combine();
process();


// combine files into 1

function combine() {
	var out = [];
	glob.sync("archive-data/*.json").forEach(p => {

		var data = fs.readFileSync(p);
		data = JSON.parse(data);

		var f = [];
		_.each(data, function(d,key){
			f.push({
				key: key,
				timestamp: d.split(" ")[0],
				arrival_time: d.split(" ")[1],
				hour: timeConverter(d.split(" ")[1]).split(":")[0]
			});
		});

		f = _.filter(f, function(d) { return d.key.indexOf("631") > -1; });

		f = _.groupBy(f, "hour");

		_.each(f, function(d,key){
			out.push({
				day: p.split("/")[1].replace(".json", ""),
				hour: key,
				count: d.length
			});
		});

		console.log(p)
	});

	fs.writeFileSync("grand-central-by-hour.json", JSON.stringify(out, null, 2));
}

function n(n){
   return n > 9 ? "" + n: "0" + n;
}

function timeConverter(UNIX_timestamp){
 var a = new Date(UNIX_timestamp * 1000);
 var hour = a.getHours();
 var min = a.getMinutes();
 var sec = a.getSeconds();
 var time = n(hour) + ':' + n(min) + ':' + n(sec) ;
 return time;
}


 // turn file into 

 // get rid of weekends
function process() {
	var data = fs.readFileSync("grand-central-by-hour.json");
	data = JSON.parse(data);

	_.each(data, function(d){
		d.weekday = new Date(d.day).getDay() != 5 && new Date(d.day).getDay() != 6 ? true : false;
	});

	// data = _.filter(out)
}