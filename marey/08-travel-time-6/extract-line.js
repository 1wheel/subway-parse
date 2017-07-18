var { _, cheerio, d3, fs, glob, io, queue, request } = require('scrape-stl')

// just a slice of 2016
var validDates = '2016-02-01 2016-02-02 2016-02-03 2016-02-04 2016-02-05 2016-02-06 2016-02-07 2016-02-08 2016-02-09 2016-02-10 2016-02-11 2016-02-12 2016-02-13 2016-02-14 2016-02-15 2016-02-16 2016-02-17 2016-02-18 2016-02-19 2016-02-20 2016-02-21 2016-02-22 2016-02-23 2016-02-24 2016-02-25 2016-02-26 2016-02-27 2016-02-28 2016-02-29 2016-03-01 2016-03-02 2016-03-03 2016-03-04 2016-03-05 2016-03-06 2016-03-07 2016-03-08 2016-03-09 2016-03-10 2016-03-11 2016-03-12 2016-03-13 2016-03-14 2016-03-15 2016-03-16 2016-03-17 2016-03-18 2016-03-19 2016-03-20 2016-03-21 2016-03-22 2016-03-23 2016-03-24 2016-03-25 2016-03-26 2016-03-27 2016-03-28 2016-03-29 2016-03-30 2016-03-31 2016-04-01 2016-04-02 2016-04-03 2016-04-04 2016-04-05 2016-04-06 2016-04-07 2016-04-08'


var route = '6'
var direction = 'S' 

var days = glob.sync(__dirname + '/../../archive-data/*.tsv')
  .map(path => {
    var date = path.split('/').slice(-1)[0].replace('.tsv', '')

    if (!validDates.includes(date)) return []

    var arrivals = io.readDataSync(path)
      .filter(d => d.isValid == 'true')
      .filter(d => d.route == route)
      .filter(d => d.stop.includes(direction))

    arrivals
      .forEach(d => d.date = date)

    console.log(date, arrivals.length)

    return arrivals
})

io.writeDataSync(__dirname + '/' + route + '-' + direction + '.tsv', _.flatten(days))