var GtfsRealtimeBindings = require('gtfs-realtime-bindings')
var { _, cheerio, d3, fs, glob, io, queue, request } = require('scrape-stl')


var trip_id = '032200_6..S01X004'
var trip_slug = '032200_6'
// var trip_id = '032200_6..S'
// var trip_slug = '032200_6-s'

// var trip_id = "015950_6..S01X004" 
// var trip_slug = '015950_6'

// var trip_id = "043400_6..S02R" 
// var trip_slug = '043400_6'

// var trip_id = "058550_6..S07X001" 
// var trip_slug = '058550_6'

// var trip_id = "084550_6..S03X001" 
// var trip_slug = '084550_6'


var trip_id = '085300_6..S03X001'
var trip_slug = '085300_6'
var trip_id = '085300_6..S'
var trip_slug = '085300_6-s'

var trip_id = '065100_6..S02X001'
var trip_slug = '065100_6'
var trip_id = '065100_6..S'
var trip_slug = '065100_6-s'



var dataPath = __dirname + '/../../' + '2017-06-05'


var tripStop2time = {}
glob.sync(dataPath + '/*').forEach(path => {
  var slug = path.split('/').slice(-1)[0]
  var outDir = __dirname + '/raw-single/' + trip_slug + '/'
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir)

  try {
    // if (slug == 'gtfs-2017-06-05-00-06-05') return
    var buffer = fs.readFileSync(path)
    var feed = GtfsRealtimeBindings.FeedMessage.decode(buffer)
  } catch (e){
    return //console.log(e)
  }

  feed.entity.forEach(entity => {
    if (!entity.trip_update) return
    if (entity.trip_update.trip.trip_id != trip_id) return

    var trip = entity.trip_update.trip.trip_id
    entity.trip_update.stop_time_update.forEach(d =>{
      var stop = d.stop_id
      var time = (d.departure || d.arrival).time.low
      tripStop2time[trip + ' ' + stop] = time
    })
    // console.log(tripStop2time)
    entity.timestamp = feed.header.timestamp.low
    io.writeDataSync(outDir + slug + '.json', entity)
  })
})

var allTicks = glob.sync(__dirname + '/raw-single/' + trip_slug + '/*').map(io.readDataSync)
io.writeDataSync(__dirname + '/' + trip_slug + '.json', allTicks)




//filter rougte id to 456
//GS is the shuttle
// has all the shed'd stops
// stop time update has when they think it will arrive
// as it continues to move
// http://web.mta.info/developers/MTA-Subway-Time-historical-data.html
