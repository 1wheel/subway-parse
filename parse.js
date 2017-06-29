var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
var { _, cheerio, d3, fs, glob, io, queue, request } = require('scrape-stl');

var stats = {};
// _.each(listofdays, function(date){

// glob.sync(__dirname + '/dl-all/raw-days/*').forEach(path => {
//   parseDate(path, path.split("/").slice("-1")[0])
// })

// parseDate(__dirname + '/dl-all/raw-days/2017-06-15', '2017-06-15')
parseDate(__dirname + '/2017-06-05', '2017-06-05')


function parseDate(path, date){
  var tripStop2time = {};

  glob.sync(path + '/*').forEach(p => {
    var slug = p.split('/').slice(-1)[0];

    console.log(slug)
    try {
      var buffer = fs.readFileSync(p);
      var feed = GtfsRealtimeBindings.FeedMessage.decode(buffer);
    } catch (e) {
      return;
    }

    feed.entity.forEach(entity => {
      if (!entity.trip_update) return;

      var rawTripId = entity.trip_update.trip.trip_id
      var tripComponents = rawTripId.split('.').filter(d => d)
      var trip = tripComponents[0] + '_' + (tripComponents[1] ? tripComponents[1].substring(0,1) : '');
      var trip = rawTripId
      var route = trip.split("_")[1].substring(0,1);
      if (route == "4" || route == "5" || route == "6") {

        trip = trip.split("..")[0] + trip.split("..")[1].slice(0,1) 
        console.log(trip)

        entity.trip_update.stop_time_update.forEach(d => {
          var stop = d.stop_id;
          var time = d.arrival || d.departure ? (d.arrival || d.departure).time.low : 0;
          tripStop2time[trip + ' ' + stop] = feed.header.timestamp.low + " " + time;
        });
      }
    });
  });


  io.writeDataSync(__dirname + '/archive-data/' + date + '.json', tripStop2time);

  var tidy = d3.entries(tripStop2time).map(d => {
    return {
      route: d.key.split(" ")[0].split("_")[1].substring(0,1),
      trip: d.key.split(' ')[0],
      stop: d.key.split(' ')[1],
      time: d.value
    };
  });
  io.writeDataSync(__dirname + '/archive-data/' + date + '.tsv', tidy);
}


// fs.writeFileSync("new-dl-summary.json", JSON.stringify(stats, null, 2));