var fs = require("fs"),
		_ = require("underscore");


var sched = fs.readFileSync("numberOfTripsPerDay_20170522_20170616.json");
sched = JSON.parse(sched);

var sched_summary = {};
_.each(sched, function(s,key){
	_.each(s, function(t,tkey){
		_.each(t, function(d, dkey){
			if (!sched_summary[dkey]){
				sched_summary[dkey] = 0;
			}
			_.each(d, function(a){
				sched_summary[dkey] += a;	
			});
		});
	});
});


// trips data

var days = ["0522", "0523", "0524", "0526","0529", "0530", "0531", "0601", "0602", "0605", "0606", "0607"];

var summary = {};
_.each(days, function(d){
	var data = fs.readFileSync("rtTrips_2017" + d + ".json");
	data = JSON.parse(data);

	summary[d] = data.length;

});
console.log(summary)


// detailed data

var days = ["0614", "0615"];

var summary = {}
_.each(days, function(d){
	var data = fs.readFileSync("rtPredictions_2017" + d + ".json");
	data = JSON.parse(data);
	var trips = _.uniq(_.pluck(data, "rtTripId"));
	summary[d] = trips.length;
});
console.log(summary)