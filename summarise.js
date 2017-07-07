var _ = require("underscore");
var fs = require("fs");
var glob = require("glob");
var json2csv = require("json2csv");

// combine();
// process();
// out();
schedule();


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
				hour: timeConverter(d.split(" ")[1]).split(":")[0],
				hour_route_dir: timeConverter(d.split(" ")[1]).split(":")[0] + " _" + key.split(" ")[0].split("_")[1] + "_" + key.substr(key.length - 1)
			});
		});

		f = _.filter(f, function(d) { return d.key.indexOf("631") > -1; });

		f = _.groupBy(f, "hour_route_dir");

		_.each(f, function(d,key){
			out.push({
				date: p.split("/")[1].replace(".json", ""),
				hour_route_key: key,
				count: d.length
			});
		});

	});

	_.each(out, function(d){
		d.weekday = new Date(d.date).getDay() != 5 && new Date(d.date).getDay() != 6 ? true : false;
	});

	out = _.filter(out, function(d) { return d.weekday === true; });

	fs.writeFileSync("grand-central-by-hour.json", JSON.stringify(out, null, 2));
}

function out() {
	var data = fs.readFileSync("grand-central-by-hour.json");
	data = JSON.parse(data);

	var fields = ["date", "hour_route_key", "count"];
	var result = json2csv({data: data, fields: fields});
	fs.writeFileSync("grand-central-by-hour.csv", result);
}





function schedule() {
	var data = fs.readFileSync("google_transit/stop_times.json");
	data = JSON.parse(data);

	console.log(_.uniq(_.pluck(data, "stop_id")))
	data = _.filter(data, function(d) { return d.stop_id.indexOf("631") > -1; });

	console.log(data)
}

// helper functions

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




