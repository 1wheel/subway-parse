var GtfsRealtimeBindings = require('gtfs-realtime-bindings')
var { _, cheerio, d3, fs, glob, io, queue, request } = require('scrape-stl')



var tripStop2time = {}
// just extract 143250
glob.sync(__dirname + '/2017-06-05/*').forEach(path => {
  var slug = path.split('/').slice(-1)[0]
  // console.log(slug)

  try {
    if (slug == 'gtfs-2017-06-05-00-06-05') return
    var buffer = fs.readFileSync(path)
    var feed = GtfsRealtimeBindings.FeedMessage.decode(buffer)
  } catch (e){
    return //console.log(e)
  }

  feed.entity.forEach(entity => {
    if (!entity.trip_update) return
    if (entity.trip_update.trip.trip_id != '143250_6..S01R') return

    var trip = entity.trip_update.trip.trip_id
    entity.trip_update.stop_time_update.forEach(d =>{
      var stop = d.stop_id
      var time = (d.departure || d.arrival).time.low
      tripStop2time[trip + ' ' + stop] = time
    })
    // console.log(entity)
    console.log(tripStop2time)
    entity.timestamp = feed.header.timestamp.low
    io.writeDataSync(__dirname + '/143250/' + slug + '.json', entity)
  })
})

//filter rougte id to 456
//GS is the shuttle
// has all the shed'd stops
// stop time update has when they think it will arrive
// as it continues to move
// http://web.mta.info/developers/MTA-Subway-Time-historical-data.html
