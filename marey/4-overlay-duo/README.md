checking out wha happens when using no strict parsing for two trips that look identical:

Loops back on itself:
032200_6..S
032200_6..S01X004

Looks normal:
065100_6..S02X001
065100_6..S

085300_6..S
085300_6..S03X001


I think only using the `085300_6..S` bit of the id is sufficient as a unique identifier for trips during one day.