var { _, cheerio, d3, jp, fs, glob, io, queue, request } = require('scrape-stl')

// just extract 143250

var allTicks = glob.sync(__dirname + '/143250/*').map(io.readDataSync)
var trip = allTicks[0].trip_update.trip
// console.log(trip)

var allUpdates = _.flatten(allTicks.map(d => d.trip_update.stop_time_update))
allUpdates.forEach(d => {
  d.time = (d.departure || d.arrival).time.low
})
// console.log(allUpdates)
// console.log(allUpdates[0])

var byStop = jp.nestBy(allUpdates, d => d.stop_id)


byStop[10].forEach(d => console.log(d.time))

var byStopOut = byStop.map(d => {
  return {
    stop: d.key,
    time: _.last(d).time
  }
})

console.log(byStopOut)

// arrival and departure times match
// gtfs timestamps have a 30 second resolution 
// next arrival can take place -after- the current timestamp 
// not sure there is a ton we can do with the current timestamp... maybe look at how long trains sat at station? 
allTicks.forEach(d => {
  var nextArrival = d.trip_update.stop_time_update[0]
  // console.log(nextArrival)
  var nextTime = nextArrival.arrival.time.low
  var nextDept = (nextArrival.departure || nextArrival.arrival).time.low
  var nextStop = nextArrival.stop_id
  console.log(d.timestamp, nextTime, nextTime - nextDept, nextStop, d3.format('+3')(nextTime - d.timestamp))
})
