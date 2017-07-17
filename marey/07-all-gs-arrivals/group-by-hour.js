var { _, cheerio, d3, jp, fs, glob, io, queue, request } = require('scrape-stl')

var stop = 631


var data = io.readDataSync(__dirname + '/' + stop + '.tsv')


data.forEach(function(d){
  d.arrivalTime = +d.arrival*1000
  d.hour = d3.timeFormat('%H')(d.arrivalTime)

  d.direction = d.stop[3]
})

var holidays = [
  "2016-01-01",
  "2016-01-18",
  "2016-02-15",
  "2016-05-30",
  "2016-07-04",
  "2016-09-05",
  "2016-10-10",
  "2016-11-11",
  "2016-11-24",
  "2016-12-26",
  "2017-01-02",
  "2017-01-16",
  "2017-02-20",
  "2017-05-29",
  "2017-07-04",
  "2017-09-04",
  "2017-10-09",
  "2017-11-10",
  "2017-11-23",
  "2017-12-25"
]

var byHour = jp.nestBy(data, d => [d.date, d.hour, d.route, d.direction].join(' '))
	.map(d => {
    var date = d[0].date
		var datetime = d3.timeParse('%Y-%m-%d')(date)
		d.dayOfWeek = d3.timeFormat('%w')(datetime)

		return {
			hour_route_key: d.key.split(' ').slice(1).join(' '),
			weekday: d.dayOfWeek != 0 && d.dayOfWeek != 6 && !holidays.includes(date),
			date,
      count: d.length
		}
	})
io.writeDataSync(__dirname + '/' + stop + '-by-hour.csv', byHour)

