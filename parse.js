var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
var { _, cheerio, d3, fs, glob, io, queue, request } = require('scrape-stl');

var stats = {};
// _.each(listofdays, function(date){

  glob.sync(__dirname + '/dl-all/raw-days/*').forEach(path => {

    var tripStop2time = {};
    var date = path.split("/").slice("-1")[0];

    glob.sync(path + '/*').forEach(p => {
      console.log(p)
      var slug = p.split('/').slice(-1)[0];

      try {
        var buffer = fs.readFileSync(p);
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
            var time = d.departure || d.arrival ? (d.departure || d.arrival).time.low : 0;
            tripStop2time[trip + ' ' + stop] = time;
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
  });


// fs.writeFileSync("new-dl-summary.json", JSON.stringify(stats, null, 2));