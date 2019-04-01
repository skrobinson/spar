/*
 * spar jQuery UI Widget
 *
 * A multi-round countdown timer to support in-person exams.
 *
 * @updated February 27, 2019
 * @version Gypsum
 *
 * @author Sean Robinson <sean.robinson@scottsdalecc.edu>
 * @copyright (c) 2018,2019 Scottsdale Community College
 */

'use strict';

/* longtailThrottle - time-based throttle function with a tail extender
 *
 * 'responder' events are triggered once per 'interval' after the first
 * 'inciter' event.  'responder' events stop triggering when at least 'tail'
 * number of 'responder' events have been emitted since the most recent
 * 'inciter' event.
 *
 * Sample:
 *   time (ms)  000 010 020 030 100 150 200 250 300 350 400
 *     inciter   R   R       R       R
 *   responder                   T       T       T       T
 *               R = receive     T = trigger
 *
 * @param {String} inciter - name of event listened for
 * @param {String} responder - name of event to emit
 * @param {Number} interval - Time between responder event calls.  Defaults
 * to 100 milliseconds.
 * @param {Number} tail - Number of times to fire responder after last inciter
 * event.  Defaults to 3 times.
 */
function longtailThrottle(inciter, responder, interval = 100, tail = 3) {
    var intervalTimer = null;
    var tailCounter = tail;
    $(window).on(inciter, function() {
        if (intervalTimer === null) {
            // Set up a new interval to trigger child events.
            intervalTimer = setInterval(function() {
                if (tailCounter < 1) {
                    // Interval has triggered tailCounter times, so stop.
                    clearInterval(intervalTimer);
                    intervalTimer = null;
                    tailCounter = tail;
                } else {
                    $(window).trigger(responder);
                    tailCounter--;
                }
            }, interval);
        } else {
            tailCounter = tail;
        }
    });
}

/* pause - delay a Promise chain
 *
 * Use this to insert a pause in a Promise chain, passing the fulfillment
 * value on to following clauses.
 *
 * @param {Number} delay - time in milliseconds to delay Promise chain
 * @returns {Promise}
 */
function pause(delay) {
    return value => $.Deferred(
                        dfd => setTimeout(() => dfd.resolve(value), delay)
                    ).promise();
}

/* remainderText - return a function to make new label text
 *
 * Returns a closure over an arrow function.  Fun with ES6.
 *
 * @param {Integer} max - maximum number of rounds
 * @returns {Function}
 *
 * The returned function accepts a round number and returns a string to
 * use as a label in the rounds progressbar.
 *
 * @param {Integer} current - current round
 * @returns {String}
 */
function remainderText(max) {
    let labelEnd = ' rounds remaining';
    return (current) => (max - current) + labelEnd;
}

$.widget('scottsdalecc.spar', {
    options: {
        interval: 60000,  // milliseconds per round (i.e. one mineral)
        nrRounds: 25,  // number of countdowns to show
        pause: 2000,  // hidden delay between rounds, in milliseconds
        sound: true,  // play sounds ending each round
        // Defaults for rounddown appearance
        timerOpts: {
            autostart: false,
            fillStyle: '#000000',  // solid black interior
            fontColor: '#FFFFFF',  // white text
            label: [],
            radius: 40,
            smooth: true,
            strokeStyle: '#FFFFFF',  // white border
            strokeWidth: 15  // border width
        }
    },

    _create: function() {
        // Save some shorthand variable names.
        let params = this.getParams(window.location.search);
        let session = $.extend({}, this.options, params);
        // Fate is resolved at the end (of the progressbar count down)
        // and notifies progress listeners about the end of each round.
        let fate = $.Deferred();
        // Tick notifies at each second for which a 'tick' should sound.
        let tick = $.Deferred();
        let currentRound = 0;
        // Calculate a session pause, keeping in mind the fade out and in durations.
        session.fadeDuration = session.pause / 7;
        session.pause = session.pause / 2 - session.fadeDuration;
        // Save a partial function to return text for the progress bar.
        let updateLabel = remainderText(session.nrRounds);
        let seriesLabel = $('#rounds-counter > .progress-label');
        // Create a countdown timer to measure time for each pair of questions.
        let timer = $('#timer').rounddown($.extend(
                                            {duration: session.interval},
                                             session.timerOpts
                                          ));
        // Create a progress bar for the entrire exam length.
        let seriesPBar = $('#rounds-counter').progressbar({
            change: () => seriesLabel.text(updateLabel(currentRound)),
            complete: () => fate.reject('complete'),
            max: session.nrRounds,
            value: 0
        });
        // Create a Begin-Pause-Resume button.
        let buttonStates = [
            {
                text: 'Begin',
                next: 'Pause',
                func: timer.rounddown.bind(timer, 'start')
            },
            {
                text: 'Pause',
                next: 'Resume',
                func: timer.rounddown.bind(timer, 'pause')
            },
            {
                text: 'Resume',
                next: 'Pause',
                func: timer.rounddown.bind(timer, 'resume')
            }
        ];
        let controlButton = $('#control-button').unibutton({
            states: buttonStates
        });
        // Set to begin at round 0.
        seriesLabel.text(updateLabel(0));
        // Notify fate progress listeners about round number increments.
        let onTime = timer.rounddown('option', 'onTime');
        onTime[0] = () => fate.notify(++currentRound);
        // Optionally, play 2 ticks and a bell at the end of each round.
        if (session.sound) {
            // The audio object is the first item in the jQuery object collection.
            fate.progress(() => $('#sound-bell')[0].play());
            tick.progress(() => $('#sound-tick')[0].play());
            // Trigger 2 tick sounds before end bell.
            for (let i = 1; i < 2; i++) {
                onTime[i] = t => tick.notify(t);
            }
        }
        // Stop the timer for session.pause milliseconds after each round.
        // The hidden pause gives time for students to physically pass samples.
        fate.progress(() => $.when()
                                .then($.fn.button.bind(controlButton, 'disable'))
                                .then(timer.rounddown.bind(timer, 'stop'))
                                .then(pause(session.pause))
                                .then(() => timer.fadeTo(session.fadeDuration, 0.001)
                                                 .promise())
                                .then(timer.rounddown.bind(timer, 'draw'))
                                .then(() => timer.fadeTo(session.fadeDuration, 1)
                                                 .promise())
                                .then(pause(session.pause))
                                // Rejected promise skips the following
                                // resolved callbacks.
                                .then(() => fate.state() === 'rejected' &&
                                                fate.promise())
                                .then($.fn.button.bind(controlButton, 'enable'))
                                .then(timer.rounddown.bind(timer, 'start')));
        // Signal the progress bar to move.
        fate.progress(index => seriesPBar.progressbar({ value: index }));
        $('body').on('keydown keypress', function(e) {
            if (e.keyCode === $.ui.keyCode.SPACE ||
                e.keyCode === $.ui.keyCode.PAGE_DOWN) {
                // When spacebar or PageDown is pressed, click the unibutton.
                // PageDown is sent by Kensington Wireless Presenter right
                // arrow button.
                controlButton.trigger('click');
            }
        });
        // Re-emit resize event as a custom event, with extended throttling.
        longtailThrottle('resize', 'spar-resize');
        // Resize rounddown timer to fit window.
        $(window).on('spar-resize', function() {
            return $.when($(window).height() > $(window).width())
                // Promise value is boolean; true for portrait mode.
                .then(vertical => vertical && $(window).width())
                // Promise value is false or actual width
                .then(width => width || $(window).height())
                // Promise value is the constraining dimension measurement.
                .then(dim => dim === $(window).width() && dim ||
                                dim - $('#rounds').height() - $('#controls').height())
                // Promise value is the initial canvas height.
                // Remove border width (2x) and shrink to 95%.
                .then(h => (h - session.timerOpts.strokeWidth * 2) * 0.95)
                // Promise value is optimal timer diameter.
                .then(diameter => timer.rounddown('radius', diameter / 2 ));
        });
        // Once things settle, resize the countdown to fit the screen.
        $.when(pause(10)).then(() => $(window).trigger('resize'));
    },

    /* getParams - returns converted search parameters
     *
     * Values in paramString will be converted to their individual type and
     * returned in an object which may be combined with this.options.
     *
     * @param {String} paramString - A URL search string to be converted.
     * @returns {object}
     */
    getParams(paramString) {
        let options = this.options;
        // Translate a URLSearchParams object into a plain object because
        // jQuery.each does not, yet, handle the ES2015 iterable protocol.
        let params = {};
        let searchParams = new URLSearchParams(paramString);
        searchParams.forEach(function(value, key) {
            params[key] = value;
        });
        // Convert each String value to appropriate type.
        $.each(params, function(name, value) {
            if (options[name] !== undefined) {
                if (value === 'false') {
                    // Special case for a broken JS type system.  Arghhh!
                    value = false;
                }
                params[name] = options[name].constructor(value);
            } else {
                // Only params defined in this.options may be used in the URL.
                console.warn('unrecognized URL search parameter:', name);
                delete params[name];
            }
        });
        return params;
    }
});

/* unibutton - a multi-phase button
 *
 * @param {Array} states - A list of objects describing button states.  The
 * first state listed is the first state into which the button will be placed
 * after creation.
 *
 * Throws an error if no states are provided.
 *
 * A state object in the states list should contain the following properies:
 *       text: current button text
 *       next: target button text on click
 *       func: function to call on click
*/
$.widget('scottsdalecc.unibutton', {
    options: {
        states: []
    },

    _create: function() {
        if (this.options.states.length < 1) {
            throw new Error('A unibutton must have at least one state.');
        }
        let stateTexts = $.map(this.options.states, (e, i) => e.text);
        let oneButton = this.element;
        // Label the button with the initial state text.
        oneButton.button({ label: stateTexts[0] })
        // Ready event handlers.
        this._on(oneButton, {
            click: function() {
                // Get the current state object from the current label.
                let label = oneButton.button('option', 'label');
                let state = $.grep(this.options.states,
                                      (e, i) => e.text === label)[0];
                $.when()
                    // Temporarily disable button to ignore clicks.
                    .then($.fn.button.bind(oneButton, 'disable'))
                    .then(pause(100))
                    // Call the provided function for the current state.
                    .then(state.func)
                    // Change to next state and enable.
                    .then($.fn.button.bind(oneButton, 'option', 'label', state.next))
                    .then($.fn.button.bind(oneButton, 'enable'));
            }
        });
    }
});
