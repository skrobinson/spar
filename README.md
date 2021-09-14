Spar
====

Spar is an in-browser, Javascript-based, multi-round countdown timer. Its main
purpose is to support Scottsdale Community College GLG101IN mineral quizzes.
But it is flexible enough that others may find it useful.


Use
---

The single, large button on the countdown screen can be clicked to start,
pause, and resume the countdown. The space bar will operate the button
without a mouse.


Customization
-------------

For a custom timer, the following options can be passed in the URL
search parameters:

- interval: milliseconds per round (default: 60000)
- nrRounds: number of countdowns to show (default: 25)
- pause: hidden delay between rounds, in milliseconds (default: 2000)
- sound: play sounds ending each round (default: true)

The default values reflect a 25 round quiz with 1 minute per round. At the
end of each round, students change to the next mineral sample for the next
round. A two second delay between rounds gives a little time to make the
change without taking up too much quiz time. Three tones sound at the end
of each round to cue students to change samples.

The following sample creates a countdown timer with 3 rounds of 10 seconds
each, 1.5 seconds between rounds, and sounds played at the end of each round.

```html
spar.html?interval=10000&nrRounds=3&pause=1500&sound=true`
```

The appearance (e.g. colors) of Spar can be changed by editing `timerOpts`
object values and `resources/spar.css`.


License
-------

Copyright 2018,2019 Scottsdale Community College

Spar is published under the GPL v3+ license.


Acknowledgements
----------------

Spar and its tests use:

[jQuery UI](http://jqueryui.com), licensed under the MIT license

[jQuery JavaScript Library](http://jquery.com), licensed under the MIT license

[RoundDown](http://github.com/skrobinson/rounddown), licensed under the MIT
license

[WadJS](https://github.com/rserota/wad) by Raphael Serota, licensed under the
MIT license

A custom version of [Blanket.js](https://github.com/alex-seville/blanket),
original by Alex-Seville, licensed under the MIT license

[jQuery Simulate](https://github.com/jquery/jquery-simulate), licensed under
the MIT license

[QUnit](https://qunitjs.com), licensed under the MIT license
