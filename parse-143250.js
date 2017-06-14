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
// [ { stop: '607S', time: 1496635225 },
//   { stop: '608S', time: 1496635330 },
//   { stop: '609S', time: 1496635418 },
//   { stop: '610S', time: 1496635502 },
//   { stop: '611S', time: 1496635572 },
//   { stop: '612S', time: 1496635683 },
//   { stop: '613S', time: 1496635801 },
//   { stop: '614S', time: 1496635915 },
//   { stop: '615S', time: 1496636014 },
//   { stop: '616S', time: 1496636108 },
//   { stop: '617S', time: 1496636204 },
//   { stop: '618S', time: 1496636276 },
//   { stop: '619S', time: 1496636366 },
//   { stop: '621S', time: 1496636541 },
//   { stop: '622S', time: 1496636694 },
//   { stop: '623S', time: 1496636769 },
//   { stop: '624S', time: 1496636850 },
//   { stop: '625S', time: 1496636948 },
//   { stop: '626S', time: 1496637144 },
//   { stop: '627S', time: 1496637255 },
//   { stop: '628S', time: 1496637347 },
//   { stop: '629S', time: 1496637436 },
//   { stop: '630S', time: 1496637530 },
//   { stop: '631S', time: 1496637648 },
//   { stop: '632S', time: 1496637799 },
//   { stop: '633S', time: 1496637871 },
//   { stop: '634S', time: 1496637940 },
//   { stop: '635S', time: 1496638034 },
//   { stop: '636S', time: 1496638158 },
//   { stop: '637S', time: 1496638247 },
//   { stop: '638S', time: 1496638324 },
//   { stop: '639S', time: 1496638396 },
//   { stop: '640S', time: 1496638477 } ]

// { '143250_6..S01R 607S': 1496635225,
//   '143250_6..S01R 608S': 1496635330,
//   '143250_6..S01R 609S': 1496635418,
//   '143250_6..S01R 610S': 1496635502,
//   '143250_6..S01R 611S': 1496635572,
//   '143250_6..S01R 612S': 1496635683,
//   '143250_6..S01R 613S': 1496635801,
//   '143250_6..S01R 614S': 1496635915,
//   '143250_6..S01R 615S': 1496636014,
//   '143250_6..S01R 616S': 1496636108,
//   '143250_6..S01R 617S': 1496636204,
//   '143250_6..S01R 618S': 1496636276,
//   '143250_6..S01R 619S': 1496636366,
//   '143250_6..S01R 621S': 1496636541,
//   '143250_6..S01R 622S': 1496636694,
//   '143250_6..S01R 623S': 1496636769,
//   '143250_6..S01R 624S': 1496636850,
//   '143250_6..S01R 625S': 1496636948,
//   '143250_6..S01R 626S': 1496637144,
//   '143250_6..S01R 627S': 1496637255,
//   '143250_6..S01R 628S': 1496637347,
//   '143250_6..S01R 629S': 1496637436,
//   '143250_6..S01R 630S': 1496637530,
//   '143250_6..S01R 631S': 1496637648,
//   '143250_6..S01R 632S': 1496637799,
//   '143250_6..S01R 633S': 1496637871,
//   '143250_6..S01R 634S': 1496637940,
//   '143250_6..S01R 635S': 1496638034,
//   '143250_6..S01R 636S': 1496638158,
//   '143250_6..S01R 637S': 1496638247,
//   '143250_6..S01R 638S': 1496638324,
//   '143250_6..S01R 639S': 1496638396,
//   '143250_6..S01R 640S': 1496638477 }
// arrival and departure times match
// gtfs timestamps have a 30 second resolution 
// next arrival can take place -after- the current timestamp 
// not sure there is a ton we can do with the current timestamp... maybe look at how long trains sat at station? 
allTicks.forEach(d => {
  return
  var nextArrival = d.trip_update.stop_time_update[0]
  // console.log(nextArrival)
  var nextTime = nextArrival.arrival.time.low
  var nextDept = (nextArrival.departure || nextArrival.arrival).time.low
  var nextStop = nextArrival.stop_id
  console.log(d.timestamp, nextTime, nextTime - nextDept, nextStop, d3.format('+3')(nextTime - d.timestamp))
})
