console.clear()

var color = d3.scaleOrdinal(d3.schemeCategory10);

d3.select('html').selectAppend('div.tooltip').classed('tooltip-hidden', true)

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

  gsStops = data
    .filter(d => d.isValid)
    .filter(d => d.station == 631)

  dateExtent = d3.extent(gsStops, d => d.arrivalTime)

  var byLine = d3.nestBy(gsStops, d => d.direction + d.route)
  byLine = _.sortBy(byLine, d => d.key)
  byLine.forEach(d => d.key = d.key.split('').reverse().join(''))

  var byLineSel = d3.select('#graph').html('').appendMany(byLine, 'div')
    .st({width: 430, display: 'inline-block'})

  byLineSel.append('h3').text(d => d.key)
  byLineSel.each(perHourChart)
})


function perHourChart(data){
  // throw 'up'
  var route = data.key
  // if (route != '4S') return

  data = _.sortBy(data, d => d.arrivalTime)
  data.forEach((d, i) => {
    var prev = data[i - 1]
    if (!prev) return

    d.gap = d.arrivalTime - prev.arrivalTime
    d.perHour = 1000*60*60/d.gap

    d.rolling = data.slice(i - 10, i).filter(d => d.perHour)
    d.rollingPerHour = d3.mean(d.rolling, d => d.perHour)

    var prev10 = data[i - 10]
    if (!prev10) return
    d.gap10 = d.arrivalTime - prev10.arrivalTime
    d.perHour10 = 1000*60*60/d.gap10*10
  })

  var c = d3.conventions({parentSel: d3.select(this), margin: {}, height: 200, width: 400})

  c.x.domain(dateExtent)
  c.y.domain([0, 30])

  c.yAxis.ticks(5)
  c.xAxis.tickFormat(d3.timeFormat('%H:%M')).ticks(5)
  c.drawAxis()

  vData = data.filter(d => d.perHour)

  var line = d3.line()
    .x(d => c.x(d.arrivalTime))
    // .y(d => c.y(d.rollingPerHour))
    .y(d => c.y(d.perHour10))

  var area = d3.area()
    .x(d => c.x(d.arrivalTime))
    // .y(d => c.y(d.rollingPerHour))
    .y1(d => c.y(d.perHour10))
    .y0(c.height)

  c.svg.append('path')
    .at({
      // d: line(vData.filter(d => d.rolling.length > 5)),
      d: area(vData.filter(d => d.perHour10)),
      fill: '#eee',
      strokeOpacity: 0,
    })

  c.svg.append('path')
    .at({
      // d: line(vData.filter(d => d.rolling.length > 5)),
      d: line(vData.filter(d => d.perHour10)),
      fill: 'none',
      stroke: '#000'
    })

  c.svg.appendMany(vData, 'circle')
    .at({
      cx: d => c.x(d.arrivalTime),
      cy: d => c.y(d.perHour),
      r: 2,
      fill: color(route)
    })
    .call(d3.attachTooltip)



}
