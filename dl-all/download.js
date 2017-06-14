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
    '/usr/local/bin/wget https://datamine-' + date + '.s3.amazonaws.com/gtfs.tgz',
    'tar xzf gtfs.tgz'
  ].join(' && ')
  console.log(cmd)


  exec(cmd, (error, stdout, stderr) => {
    if (error) return console.error(`exec error: ${error}`)
    // console.log(`stdout: ${stdout}`);
    // console.log(`stderr: ${stderr}`);
  })

  return;

  const process = spawn(cmd)
  process.stdout.on('data', data => console.log(`stdout: ${data}`))
  process.stderr.on('data', data => console.log(`stderr: ${data}`))
  process.on('error', data => console.log(`error: ${data}`))
  process.on('close', code => {
    console.log(`child process exited with code ${code}`)
    // cb()
  })
}


q.awaitAll(err => console.log(err))
//wget https://datamine-2014-09-17.s3.amazonaws.com/gtfs.tgz && tar xvzf gtfs.tgz
