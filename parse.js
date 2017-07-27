var GtfsRealtimeBindings = require('gtfs-realtime-bindings')
var { _, cheerio, d3, jp, fs, glob, io, queue, request } = require('scrape-stl')
var argv = require('minimist')(process.argv.slice(2))

// glob.sync(__dirname + '/dl-all/raw-days/*').forEach(path => {
//   parseDate(path, path.split('/').slice('-1')[0])
// })

// glob.sync(__dirname + '/../../old/raw-days/*').forEach(path => {
//   parseDate(path, path.split('/').slice('-1')[0])
// })

glob.sync(__dirname + '/../subway/2017-07-*').forEach(path => {
  parseDate(path, path.split('/').slice('-1')[0])
})

// parseDate(__dirname + '/dl-all/raw-days/2017-06-15', '2017-06-15')
// parseDate(__dirname + '/2017-06-05', '2017-06-05')

function parseDate(path, date) {
  if (argv.month && argv.month != date.split('-')[1]) return 
  console.log(date)

  var tripStop2time = {}
  glob.sync(path + '/*').forEach(p => {
    var slug = p.split('/').slice(-1)[0]

    try {
      var buffer = fs.readFileSync(p)
      var feed = GtfsRealtimeBindings.FeedMessage.decode(buffer)
    } catch (e) { return }

    feed.entity.forEach(entity => {
      if (!entity.trip_update) return

      var trip = entity.trip_update.trip.trip_id
      var route = trip.split('_')[1].substring(0, 1)

      entity.trip_update.stop_time_update.forEach(d => {
        var stop = d.stop_id
        var time = d.arrival || d.departure ? (d.arrival || d.departure).time.low : 0
        tripStop2time[trip + ' ' + stop] = feed.header.timestamp.low + ' ' + time
      })
    })
  })

  var tidy = d3.entries(tripStop2time).map(d => {
    return {
      route: d.key.split(' ')[0].split('_')[1].substring(0, 1),
      trip: d.key.split(' ')[0],
      stop: d.key.split(' ')[1],
      timestamp: d.value.split(' ')[0],
      arrival: d.value.split(' ')[1],
      isValid: true
    }
  })

  jp.nestBy(tidy, d => d.trip).forEach(trip => {
    jp.nestBy(trip, d => d.timestamp).forEach(timestamps => {
      if (timestamps.length < 2) return
      timestamps.forEach(d => (d.isValid = false))
    })
  })

  io.writeDataSync(__dirname + '/archive-data/' + date + '.json', tripStop2time)
  io.writeDataSync(__dirname + '/archive-data/' + date + '.tsv', tidy)
}
