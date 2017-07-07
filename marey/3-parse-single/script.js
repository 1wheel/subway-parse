console.clear()
d3.select('html').selectAppend('div.tooltip')


var dataPath = '032200_6.json' // train that moves back and forth on marey 
// var dataPath = '032200_6-s.json' // train that moves back and forth on marey 
// var dataPath = '015950_6.json' // normal looking train 
// var dataPath = '043400_6.json' // delays 
// var dataPath = '058550_6.json' // normal, then runs express 
// var dataPath = '084550_6.json' // skips a single stop?

d3.loadData(dataPath, function(err, res){
  ticks = res[0]

  ticks.forEach(tick => {
    tick.trip_update.stop_time_update.forEach(d => {
      d.systemTime = tick.timestamp
      d.arrivalTime = (d.arrival || d.departure).time.low
      d.dif = d.systemTime - d.arrivalTime
    })
  })

  updates =_.flatten(ticks.map(d => d.trip_update.stop_time_update))

  var s = d3.scaleLinear()
    .domain([d3.min(updates, d => d.arrivalTime), d3.max(updates, d => d.arrivalTime)])
    .range([0, 600])


  var svg = d3.select('#graph').html('')
    .st({margin: 20, marginLeft: 100})
    .append('svg')
    .at({width: 600, height: 600})

  svg.append('g.x-axis')
    .call(d3.axisTop().scale(s).ticks(5))
  svg.append('g.y-axis')
    .call(d3.axisLeft().scale(s).ticks(5))

  svg.append('path')
    .at({d: 'M 0 0 L 600 600',})
    .st({stroke: '#0ff', strokeWidth: 3, pointerEvents: 'none'})

  byStop = d3.nestBy(updates, d => d.stop_id)
  byStop.forEach(d => {
    d.last = _.last(d)
  })

  var line = d3.line()
    .x(d => s(d.systemTime))
    .y(d => s(d.arrivalTime))

  svg.appendMany(byStop, 'path')
    .at({
      d: line, stroke: '#000', fill: 'none', opacity: 1
    })
    .call(d3.attachTooltip)

  // svg.appendMany(byStop, 'text')
  //   .translate(d => [d.last.systemTime, d.last.arrivalTime])
  //   .text(d => d.key)


})

