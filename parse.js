var GtfsRealtimeBindings = require('gtfs-realtime-bindings')
var { _, cheerio, d3, fs, glob, io, queue, request } = require('scrape-stl')

var tripStop2time = {}
glob.sync(__dirname + '/2017-06-05/*').forEach(path => {
  var slug = path.split('/').slice(-1)[0]

  try {
    if (slug == 'gtfs-2017-06-05-00-06-05') return
    var buffer = fs.readFileSync(path)
    var feed = GtfsRealtimeBindings.FeedMessage.decode(buffer)
  } catch (e) {
    return
  }

  feed.entity.forEach(entity => {
    if (!entity.trip_update) return

    var trip = entity.trip_update.trip.trip_id
    entity.trip_update.stop_time_update.forEach(d => {
      var stop = d.stop_id
      var time = (d.departure || d.arrival).time.low
      tripStop2time[trip + ' ' + stop] = time
    })
  })

  console.log(slug)
})

io.writeDataSync(__dirname + '/tripStop2time.json', tripStop2time)

var tidy = d3.entries(tripStop2time).map(d => {
  return {
    trip: d.key.split(' ')[0],
    stop: d.key.split(' ')[1],
    time: d.value
  }
})
io.writeDataSync(__dirname + '/stop-times.tsv', tidy)
