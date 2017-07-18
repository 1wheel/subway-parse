console.clear()

var color = d3.scaleOrdinal(d3.schemeCategory10);

d3.select('html').selectAppend('div.tooltip').classed('tooltip-hidden', true)


if (window.data){
  // parseData(data)
  draw(data)
} else{
  d3.loadData('631.tsv', function(err, res){
    data = res[0]
    parseData(data)
    draw(data)
  })
}


function parseData(data){
  data.forEach(function(d){
    d.arrivalTime = +d.arrival*1000
    d.hour = d3.timeFormat('%H')(d.arrivalTime)

    d.direction = d.stop[3]
  })
}


function draw(data){
  var byHour = d3.nestBy(data, d => d.hour)

  var hourSel = d3.select('#graph').html('')
    .appendMany(_.sortBy(byHour, d => d.key), 'div')
    .st({width: 800, display: 'inline-block'})
  hourSel.append('h3').text(d => d.key)

  hourSel.each(drawPerHour)
}


function drawPerHour(hour){
  var byDay = d3.nestBy(hour, d => d.date)
  byDay.forEach((d, i) => {
    d.dayIndex = i
    d.trains = d.length
    d.date = d3.timeParse('%Y-%m-%d')(d.key)
    d.dayOfWeek = d3.timeFormat('%w')(d.date)
    d.isWeekday = d.dayOfWeek != 0 && d.dayOfWeek != 6
  })

  var c = d3.conventions({parentSel: d3.select(this), height: 300})

  c.x.domain([0, byDay.length])
  c.y.domain([0, 100])

  c.drawAxis()

  c.svg.appendMany(byDay, 'path')
    .at({
      d: d => ['M', c.x(d.dayIndex), c.height, 'V', c.y(d.trains)].join(' '),
      stroke: d => d.isWeekday ? '#000' : '#ccc',
      strokeWidth: 1
    })
    .call(d3.attachTooltip)


}



