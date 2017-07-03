Extracts a single trip from the feed to look at how the schedule shifts over time. 

Looking at 032200_6..S01X004 here, system time v arrival time for each stop on the trip. 

Concerns:

The trips on very bottom clearly don't happen. They can be filtered out by comparing system time to arrival time of the last published update and removing trips with a difference of greater than two minutes. 

In the last few ticks of updates arrival time moves backwards in time, jumping back 5 minutes. It isn't clear which trips are actually completed. Because of the time jump, the difference arrival and system time for stop 635 and 636 is less than a minute on the last update. It wouldn't get filtered out with a simple comparison between arrival and system times, despite pretty clearly not actually occurring. With the current filtering, it looks like the train runs express to 635, makes one more stop at 636 and then stops.  

Could do some kind of filter ignore large jumps, but that will make parsing the data more complicated. Also there is a large jump at the start when trains actually start running - probably shouldn't throw that out? 

Ignoring data after system exceeds arrival times isn't a good blanket rule. 602S passes that threshold, then it looks like the trains actually start running. 

The very first stop might also have to be handled differently - looks like 601S's arrival time doesn't change while the train waits to start running. 



`015950_6 `is a normal looking trip. The last stop is kind of weird but ends up looking okay in the end. 

`043400_6..S02R` has a huge delay at the start then runs express. It doesn't look like it was ever scheduled to run locally for those stops.

`084550_6` it looks like when trains are delayed, they travel time doesn't update until the train starts running again. It isn't clear if the train is sitting in the platform then or stuck in the tunnel. Could exclude ticks where the first arrival time is past system time... I think setting the first train's arrival time to the system time and removing subsequently schedules stops from the feed would be a good fix -- currently the first stop after a delay is filtered out since system time passes arrival time on its last update.




TODO

check what happens when using no strict parsing for two trips that look identical:

032200_6..S
032200_6..S01X004


065100_6..S02X001
065100_6..S

Look at trips that overlap


Check one that runs express