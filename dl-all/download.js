var { _, cheerio, d3, fs, glob, io, queue, request } = require('scrape-stl')
const { spawn, spawnSync, exec } = require('child_process')

var q = queue(1)

d3
  .timeDays(new Date(2014, 8, 17), new Date())
  .map(d => d3.timeFormat('%Y-%m-%d')(d))
  .forEach(d => q.defer(downloadDate, d))

function downloadDate(date, cb) {
  var path = __dirname + '/raw-days/' + date + '/'

  var cmd = [
    'mkdir -p ' + path,
    'cd ' + path,
    'curl -s https://datamine-' + date + '.s3.amazonaws.com/gtfs.tgz | tar xz',
  ].join(' && ')
  console.log(cmd)


  exec(cmd, (error, stdout, stderr) => {
    if (error)  console.error(`exec error: ${error}`)
    if (stdout) console.log(`stdout: ${stdout}`);
    if (stderr) console.log(`stderr: ${stderr}`);
    cb()
  })
}

q.awaitAll(err => console.log(err))

// data is missing! 
// https://groups.google.com/forum/#!searchin/mtadeveloperresources/Historical%7Csort:relevance
// http://data.mytransit.nyc/subway_time/
// https://datamine-history.s3.amazonaws.com/index.html