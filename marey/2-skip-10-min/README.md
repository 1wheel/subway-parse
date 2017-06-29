Just looking at north bound 6 trains, there are a few issues:


"032200_6..S01X004" still turns back on itself after excluding +10 min abs differences. 
I think we could correct this by requring trains to only travel forward - not sure how to the totally correctly.

```
046200_6..S
052000_6..S06R
046250_6..S03R
044900_6..S02R
```

all look like they could be the same trip. `046200_6..S` and `052000_6..S06R` overlap each other for a bit


```
085300_6..S
085300_6..S03X001
```

is probably just one trip -- maybe the entire slug isn't necessary?


Dropping down to +2 min abs removes almost all double backs - which still exist? 

