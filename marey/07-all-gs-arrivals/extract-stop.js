var { _, cheerio, d3, fs, glob, io, queue, request } = require('scrape-stl')

var stop = '631'

var days = glob.sync(__dirname + '/../../archive-data/2017-07-*.tsv')
  .map(path => {
    var date = path.split('/').slice(-1)[0].replace('.tsv', '')

    var arrivals = io.readDataSync(path)
      .filter(d => d.stop.includes(stop) && d.isValid == 'true')
    arrivals
      .forEach(d => d.date = date)

    console.log(date, arrivals.length)

    return arrivals
})

io.writeDataSync(__dirname + '/july-631.tsv', _.flatten(days))