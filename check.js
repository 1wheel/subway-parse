var { _, cheerio, d3, fs, glob, io, queue, request } = require('scrape-stl');

// var listofdays = ["05-16", "05-17", "05-18", "05-19", "05-22", "05-23", "05-24", "05-25", "05-26", "06-01", "06-02",, "06-09", "06-12", "06-13"];

var listofdays = ["05-22", "05-23", "05-25", "05-26"];

var stats = [];
_.each(listofdays, function(date){

  var file = fs.readFileSync("new-dl-2017-" + date + ".json");
  file = JSON.parse(file);
  var trips = [];
  _.each(Object.keys(file), function(f){
    var trip_id = f.split(" ")[0];
    if (trips.indexOf(trip_id) == -1) {
      trips.push(f.split(" ")[0]);
    }
  });
  console.log(trips)
  stats.push({
    date: date,
    trains: trips.length
  });


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


});
fs.writeFileSync("new-dl-summary.json", JSON.stringify(stats, null, 2));