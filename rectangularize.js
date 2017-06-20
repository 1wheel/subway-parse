var fs = require("fs");
var _ = require("underscore");
	
var data = fs.readFileSync("archive-data/2017-06-15.json");
data = JSON.parse(data);

var stops456 = fs.readFileSync("stops456.json");
stops456 = JSON.parse(stops456);

var stopnames = fs.readFileSync("stops.json");
stopnames = JSON.parse(stopnames);

var out = [];
var allstops = [];

_.each(data, function(d,key){
	out.push({
		trip_id: key.split(" ")[0],
		route: key.split(" ")[0].split("_")[1],
		stop_id: key.split(" ")[1],
		time: d.split(" ")[1]
	});
});

out = _.sortBy(out, "time");
directions = ["S"];
lines = ["6"];
highlights = ["Grand Central / 42 St", "86 St", "E 180 St", "Atlantic Av / Barclays Ctr"];


var unmatched_all = [];
_.each(directions, function(dir){

	_.each(lines, function(line){

		var csvout = "";

		t = _.filter(out, function(d) { return d.stop_id.indexOf(dir) > -1 && d.route == line; });

		stops = stops456[line];

		if (dir == "N") {
			stops = stops.reverse();
		}

		t = _.groupBy(t, "trip_id");

		str = "";
		str += "trip_id	";
		str += "total_stops	";
		str += "unmatched	";
		_.each(stops, function(t){
			str += _.findWhere(stopnames, {stop_id: t}).stop_name + "	";
		});
		csvout += str + "\n";

		_.each(t, function(trains, key){

			var unmatched = [];

			str = "";
			str += key + "	";
			str += trains.length + "	";

			_.each(trains, function(tr){
				if (stops.indexOf(tr.stop_id.replace("N", "").replace("S", "")) == -1) {
					unmatched.push(tr.stop_id.replace("N", "").replace("S", ""));
					unmatched_all.push(tr.stop_id.replace("N", "").replace("S", ""));
				}
			});

			str += unmatched.length + "	";

			_.each(stops, function(stop){
				s = _.findWhere(trains, {stop_id: stop += dir});
				if (s) {
					str += timeConverter(s.time) + "	";
				} else {
					str += '""	';
				}
			});
			csvout += str + "\n";
		});

		console.log(_.unique(unmatched_all).sort(function(a,b) { return a - b; }));
		fs.writeFileSync("rectangularized/0615-" + line + dir + ".tsv", csvout);

	}); // line loop

}); // directions


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