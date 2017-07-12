console.clear()

//var bad = data.filter(d => d.trip == '038000_6')

d3.select('html').selectAppend('div.tooltip').classed('.tooltip-hidden', true)


function dayFilter(d){
  // return d.day == 5
  return true
  var hour = +d3.timeFormat('%H')(d.arrivalTime)

  return d.day == 15 && (3 <= hour && hour <= 7)
}

function stopFilter(d){
  return d.direction == 'S' && d.route == 6 && d.isValid && 
    Math.abs(d.systemTime - d.arrivalTime) < 1000*60*2

  return d.route == 6 && 
    Math.abs(d.systemTime - d.arrivalTime) < 1000*60*2 &&
    d.direction == 'S'
  return d.route == 4 || d.route == 5 || d.route == 6 //&& is6stop[d.station]
  return (''+d.station)[0] == 6
}

function byTrainFilter(d){
  return true
  return d.length > 2 && d[0].station < d[2].station
}

d3.loadData('2017-06-05-full.tsv', function(err, res){
  data = res[0]

  data.forEach(function(d){
    d.systemTime = +d.timestamp*1000
    d.arrivalTime = +d.arrival*1000
    d.station = +d.stop.replace('N', '').replace('S', '')

    d.dif = d.arrivalTime - d.systemTime
    d.absDif = Math.abs(d.dif)
    d.day = d3.timeFormat('%d')(d.arrivalTime)
    d.tstamp = d3.timeFormat('%d %H:%M')(d.arrivalTime)

    d.direction = _.last(d.stop.split(''))
    d.isValid = d.isValid == 'true'
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
  c.x.domain([0, stations.length])

  station2x = {}
  stations.forEach((d, i) => station2x[d] = c.x(i))

  c.yAxis.tickFormat(d3.timeFormat('%H:%M'))
  c.xAxis.tickFormat(d => stations[d])

  c.drawAxis()

  
  var rScale = d3.scaleSqrt().domain([0, 1000*60*10]).range([1, 12]).clamp(true)

  var line = d3.line()
    .y(d => c.y(d.arrivalTime))
    .x(d => station2x[d.station])

  
  var byTrainSel = c.svg.appendMany(byTrain, 'g')
  
  var highlights = [
    '032200_6..S01X004',  // turns back on itself
    '032200_6S',        // looks like it switches to this

    '085300_6..S03X001',  // looks like the trip was split
    '085300_6S',        // looks like the trip was split

    '065100_6..S02X001',  // looks like the trip was split
    '065100_6S',        // looks like the trip was split

    '043400_6S',     // huge delay at the start, then runs express
    '058550_6S',  // normal, then runs express 
    '084550_6S',  // skips a single stop?
    
    '015950_6S',           // normal looking trip
  ]

  byTrainSel.append('path')
    .at({d: line, stroke: '#555', fill: 'none'})
    .call(d3.attachTooltip)
    .on('click', function(d){ curdata = d})
    .classed('highlight', d => highlights.includes(d.key))
  byTrainSel
    .filter((d, i) => i < 500)
    .appendMany(d => d.filter(d => d.absDif > 1000*60*-1), 'circle')
    .translate(d => [station2x[d.station], c.y(d.arrivalTime)])
    .at({r: d => rScale(d.absDif), fill: d => d.dif < 0 ? 'steelblue' : 'orange', fillOpacity: .5, stroke: '#000'})
    .call(d3.attachTooltip)
})
