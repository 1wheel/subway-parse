console.clear()

var allStops = {
  "5": [
    "501",
    "502",
    "503",
    "504",
    "505",
    "204",
    "205",
    "206",
    "207",
    "208",
    "209",
    "210",
    "211",
    "212",
    "213",
    "214",
    "215",
    "216",
    "217",
    "218",
    "219",
    "220",
    "221",
    "222",
    "416",
    "621",
    "626",
    "629",
    "631",
    "635",
    "640",
    "418",
    "419",
    "420",
    "423",
    "234",
    "235",
    "239",
    "241",
    "242",
    "243",
    "244",
    "245",
    "246",
    "247",
    "248",
    "249",
    "250",
    "251",
    "252",
    "253",
    "254",
    "255",
    "256",
    "257"
  ],
  "4": [
    "401",
    "402",
    "405",
    "406",
    "407",
    "408",
    "409",
    "410",
    "411",
    "412",
    "413",
    "414",
    "415",
    "416",
    "621",
    "622",
    "623",
    "624",
    "625",
    "626",
    "627",
    "628",
    "629",
    "630",
    "631",
    "632",
    "633",
    "634",
    "635",
    "636",
    "637",
    "638",
    "639",
    "640",
    "418",
    "419",
    "420",
    "423",
    "234",
    "235",
    "236",
    "237",
    "238",
    "239",
    "248",
    "249",
    "250",
    "251",
    "252",
    "253",
    "254",
    "255",
    "256",
    "257"
  ],
  "6": [
    "601",
    "602",
    "603",
    "604",
    "606",
    "607",
    "608",
    "609",
    "610",
    "611",
    "612",
    "613",
    "614",
    "615",
    "616",
    "617",
    "618",
    "619",
    "621",
    "622",
    "623",
    "624",
    "625",
    "626",
    "627",
    "628",
    "629",
    "630",
    "631",
    "632",
    "633",
    "634",
    "635",
    "636",
    "637",
    "638",
    "639",
    "640"
  ]
}
//var bad = data.filter(d => d.trip == '038000_6')

d3.select('html').selectAppend('div.tooltip')

var is6stop = {}
allStops['6'].forEach(d => is6stop[d] = true)


function dayFilter(d){
  // return d.day == 5
  return true
  var hour = +d3.timeFormat('%H')(d.arrivalTime)

  return d.day == 15 && (3 <= hour && hour <= 7)
}

function stopFilter(d){
  return d.route == 6 && 
    Math.abs(d.systemTime - d.arrivalTime) < 1000*60*10 &&
    d.direction == 'S'
  return d.route == 4 || d.route == 5 || d.route == 6 && is6stop[d.station]
  return (''+d.station)[0] == 6
}

function byTrainFilter(d){
  return true
  return d[0].station < d[2].station
}

d3.loadData('2017-06-05_full-id.tsv', function(err, res){
// d3.loadData('2017-06-15.tsv', function(err, res){
  data = res[0]

  data.forEach(function(d){
    d.systemTime = +d.time.split(' ')[0]*1000
    d.arrivalTime = +d.time.split(' ')[1]*1000
    d.station = +d.stop.replace('N', '').replace('S', '')

    d.dif = d.arrivalTime - d.systemTime
    d.absDif = Math.abs(d.dif)
    d.day = d3.timeFormat('%d')(d.arrivalTime)
    d.tstamp = d3.timeFormat('%d %H:%M')(d.arrivalTime)

    d.direction = d.trip.split('..')[1][0]
  })

  data456 = data
    .filter(stopFilter)
    // .filter(dayFilter)

  data456 = _.sortBy(data456, d => d.arrivalTime)

  byTrain = d3.nestBy(data456, d => d.trip)
  byTrain = _.sortBy(byTrain, d => d[0].arrivalTime)
    .filter(d => d.every(dayFilter))
    .filter(byTrainFilter)

  byTrain.forEach(function(train){
    train.tstampStart = train[0].tstamp
  })
  byTrainGTFS = byTrain

  c = d3.conventions({parentSel: d3.select('#graph').html(''), margin: {left: 50}, height: 4000, width: 790})
  stations = _.sortBy(_.uniq(data456.map(d => d.station)))

  c.y.domain(d3.extent(data456, d => d.arrivalTime).reverse())
  // c.x.domain([1497501570000, 1497591180000])
  c.x.domain([stations.length, 0])

  station2x = {}
  stations.forEach((d, i) => station2x[d] = c.x(i))

  c.yAxis.tickFormat(d3.timeFormat('%H:%M'))
  c.xAxis.tickFormat(d => stations[d])

  c.drawAxis()

  
  var rScale = d3.scaleSqrt().domain([0, 1000*60*10]).range([1, 10]).clamp(true)

  var line = d3.line()
    .y(d => c.y(d.arrivalTime))
    .x(d => station2x[d.station])

  
  var byTrainSel = c.svg.appendMany(byTrain, 'g')
  
  byTrainSel.append('path')
    .at({d: line, stroke: '#555', fill: 'none'})
    .call(d3.attachTooltip)
    .on('click', function(d){ curdata = d})
  byTrainSel
    .filter((d, i) => i < 500)
    .appendMany(d => d.filter(d => d.absDif > 1000*60*-1), 'circle')
    .translate(d => [station2x[d.station], c.y(d.arrivalTime)])
    .at({r: d => rScale(d.absDif), fill: d => d.dif < 0 ? 'steelblue' : 'orange', opacity: .8})
    .call(d3.attachTooltip)
})

