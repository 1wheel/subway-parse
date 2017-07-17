parse log:

```
gtfs-20170323T0255Z
gtfs-20170323T0256Z
/Users/207342/Desktop/subway/parse.js:44
      var route = trip.split("_")[1].substring(0,1);
                                    ^

TypeError: Cannot read property 'substring' of undefined
    at feed.entity.forEach.entity (/Users/207342/Desktop/subway/parse.js:44:37)
    at Array.forEach (native)
    at glob.sync.forEach.p (/Users/207342/Desktop/subway/parse.js:36:17)
    at Array.forEach (native)
    at parseDate (/Users/207342/Desktop/subway/parse.js:24:26)
    at glob.sync.forEach.path (/Users/207342/Desktop/subway/parse.js:12:3)
    at Array.forEach (native)
    at Object.<anonymous> (/Users/207342/Desktop/subway/parse.js:11:48)
    at Module._compile (module.js:569:30)
    at Object.Module._extensions..js (module.js:580:10)
➜  subway git:(master) ✗
```

node parse.js --month 01 &
node parse.js --month 02 &
node parse.js --month 03 &
node parse.js --month 04 &
node parse.js --month 05 &
node parse.js --month 06 &
node parse.js --month 07 &
node parse.js --month 08 &
node parse.js --month 09 &
node parse.js --month 10 &
node parse.js --month 11 &
node parse.js --month 12