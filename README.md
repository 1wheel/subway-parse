parse log:

```
2016-04-09
/Users/207342/Desktop/subway/parse.js:37
        var time = d.arrival || d.departure ? (d.arrival || d.departure).time.low : 0
                                                                             ^

TypeError: Cannot read property 'low' of null
    at entity.trip_update.stop_time_update.forEach.d (/Users/207342/Desktop/subway/parse.js:37:78)
    at Array.forEach (native)
    at feed.entity.forEach.entity (/Users/207342/Desktop/subway/parse.js:35:43)
    at Array.forEach (native)
    at glob.sync.forEach.p (/Users/207342/Desktop/subway/parse.js:29:17)
    at Array.forEach (native)
    at parseDate (/Users/207342/Desktop/subway/parse.js:21:26)
    at glob.sync.forEach.path (/Users/207342/Desktop/subway/parse.js:10:3)
    at Array.forEach (native)
    at Object.<anonymous> (/Users/207342/Desktop/subway/parse.js:9:48)
```


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
```


```
2016-02-01
2016-02-02
2016-02-03
2016-02-04
2016-02-05
2016-02-06
2016-02-07
2016-02-08
2016-02-09
2016-02-10
2016-02-11
2016-02-12
2016-02-13
2016-02-14
2016-02-15
2016-02-16
2016-02-17
2016-02-18
2016-02-19
2016-02-20
2016-02-21
2016-02-22
2016-02-23
2016-02-24
2016-02-25
2016-02-26
2016-02-27
2016-02-28
2016-02-29
2016-03-01
2016-03-02
2016-03-03
2016-03-04
2016-03-05
2016-03-06
2016-03-07
2016-03-08
2016-03-09
2016-03-10
2016-03-11
2016-03-12
2016-03-13
2016-03-14
2016-03-15
2016-03-16
2016-03-17
2016-03-18
2016-03-19
2016-03-20
2016-03-21
2016-03-22
2016-03-23
2016-03-24
2016-03-25
2016-03-26
2016-03-27
2016-03-28
2016-03-29
2016-03-30
2016-03-31
2016-04-01
2016-04-02
2016-04-03
2016-04-04
2016-04-05
2016-04-06
2016-04-07
2016-04-08
```




For most stops along the trip path, NYC subway schedules define a transit time. Departure times are
supplied for the Origin Terminal, arrival times for the Destination Terminal. Transit times are provided
at all in-between stops except at those locations where there are “scheduled holds”. At those locations
both arrival and departure times are given.

Note that the predicted times are not updated when the train is not moving. Feed consumers can detect
this condition using the timestamp in the VehiclePosition message

stop_time_update
This includes all future Stop Times for the trip but StopTimes from the past
are omitted. The first StopTime in the sequence is the stop the train is
currently approaching, stopped at or about to leave. A stop is dropped from
the sequence when the train departs the station.