Extracts a single trip from the feed to look at how the schedule shifts over time. 

Looking at 032200_6..S01X004 here, system time v arrival time for each stop on the trip. 

Concerns:

The trips on very bottom clearly don't happen. They can be filtered out by comparing system time to arrival time of the last published update and removing trips with a difference of greater than two minutes. 

In the last few ticks of updates arrival time moves backwards in time, jumping back 5 minutes. It isn't clear which trips are actually completed. Because of the time jump, the difference arrival and system time for stop 635S is less than a minute on the last update. It wouldn't get filtered out with a simple comparison between arrival and system times, despite pretty clearly not actually occurring. 

Could do some kind of filter ignore large jumps, but that will make parsing the data more complicated. Also there is a large jump at the start when trains actually start running - probably shouldn't throw that out? 

Ignoring data after system exceeds arrival times isn't a good blanket rule. 602S passes that threshold, then it looks like the trains actually start running. 

The very first stop might also have to be handled differently - looks like 601S's arrival time doesn't change while the train waits to start running. 




```
