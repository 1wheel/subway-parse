var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
var { _, cheerio, d3, fs, glob, io, queue, request } = require('scrape-stl');

var listofdays = ["05-16", "05-17", "05-18", "05-19", "05-22", "05-23", "05-24", "05-25", "05-26", "05-29", "06-01", "06-02", "06-08", "06-09", "06-12", "06-13"];


var stats = {};
_.each(listofdays, function(date){

  var tripStop2time = {};
  glob.sync(__dirname + '/../subway/2017-' + date + '/*').forEach(path => {
    var slug = path.split('/').slice(-1)[0];
    console.log(path)

    try {
      var buffer = fs.readFileSync(path);
      var feed = GtfsRealtimeBindings.FeedMessage.decode(buffer);
    } catch (e) {
      return;
    }

    feed.entity.forEach(entity => {
      if (!entity.trip_update) return;

      var trip = entity.trip_update.trip.trip_id.split("..")[0];
      var route = trip.split("_")[1].substring(0,1);
      if (route == "4" || route == "5" || route == "6") {
        entity.trip_update.stop_time_update.forEach(d => {
          var stop = d.stop_id;
          var time = (d.departure || d.arrival).time.low;
          tripStop2time[trip + ' ' + stop] = time;
        });
      }
    });
  });

  var bytrips = _.groupBy(tripStop2time);
  if (!stats[date]) {
    stats[date] = [];
  }
  _.each(bytrips, function(trip, trip_id){
    stats[date].push({
      trip_id: trip_id,
      stops: trip.length
    });
  });

  io.writeDataSync(__dirname + '/stop-times-2017-' + date + '.json', tripStop2time);

  var tidy = d3.entries(tripStop2time).map(d => {
    return {
      route: d.key.split(" ")[0].split("_")[1].substring(0,1),
      trip: d.key.split(' ')[0],
      stop: d.key.split(' ')[1],
      time: d.value
    };
  });
  io.writeDataSync(__dirname + '/stop-times-2017-' + date + '.tsv', tidy);
  
});


fs.writeFileSync("stats.json", JSON.stringify(stats, null, 2));