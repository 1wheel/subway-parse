var GtfsRealtimeBindings = require('gtfs-realtime-bindings')
var fs = require('fs');

var buffer = fs.readFileSync('gtfs-2017-06-05-00-10-41')
 
var feed = GtfsRealtimeBindings.FeedMessage.decode(buffer);

console.log(feed)
feed.entity.forEach(function(entity) {
  if (entity.trip_update) {
    console.log(entity.trip_update.stop_time_update);
  }
});


//filter rougte id to 456
//GS is the shuttle
// has all the shed'd stops
// stop time update has when they think it will arrive
// as it continues to move 