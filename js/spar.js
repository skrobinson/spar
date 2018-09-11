/*
 * spar jQuery UI Widget
 *
 * A multi-round countdown timer to support in-person exams.
 *
 * @updated September 10, 2018
 * @version Talc
 *
 * @author Sean Robinson <sean.robinson@scottsdalecc.edu>
 * @copyright (c) 2018 Scottsdale Community College
 */

'use strict';

/* pause - resolve a Promise after a delay
 *
 * Use this to insert a pause in a Promise chain.
 *
 * @param {Number} delay - time in milliseconds to delay Promise chain
 * @returns {Promise}
 */
function pause(delay) {
    let deferred = $.Deferred();
    setTimeout(() => deferred.resolve(), delay);
    return deferred.promise();
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
        timer: null,
        // Defaults for rounddown appearance
        timerOpts: {
            autostart: false,
            fillStyle: '#000000',  // solid black interior
            fontColor: '#FFFFFF',  // white text
            label: [],
            radius: 240,
            smooth: true,
            strokeStyle: '#FFFFFF',  // white border
            strokeWidth: 15  // border width
        }
    },

    _create: function() {
        // Save some shorthand variable names.
        let params = this.getParams(window.location.search);
        let session = $.extend({}, this.options, params);
        let timer = this.options.timer;
        // Fate is resolved at the end (of the progressbar count down)
        // and notifies progress listeners about the end of each round.
        let fate = $.Deferred();
        let currentRound = 0;
        // Save a partial function to return text for the progress bar.
        let updateLabel = remainderText(session.nrRounds);
        let seriesLabel = $('#rounds-counter > .progress-label');
        // Create a countdown timer to measure time for each pair of questions.
        timer = $('#timer').rounddown(
                            $.extend(
                                {duration: session.interval},
                                session.timerOpts
                            ));
        let onTime = timer.rounddown('option', 'onTime');
        onTime[0] = () => fate.notify(++currentRound);
        // Once things settle, resize the countdown to fit screen.
        $.when(pause(10))
            .then(() => [$('#timer').parent().innerHeight(),
                         $('#timer').parent().innerWidth()])
            .then(dims => Math.min.apply(null, dims))
            .then(minDim => timer.rounddown('radius', minDim / 2.2));
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
        // Optionally, play a bell sound at the end of each round.
        if (session.sound) {
            // The audio object is the first item in the jQuery object collection.
            fate.progress(() => $('#sound-bell')[0].play());
        }
        // Stop the timer for session.pause milliseconds after each round.
        // The hidden pause gives time for students to physically pass samples.
        fate.progress(() => $.when()
                                .then($.fn.button.bind(controlButton, 'disable'))
                                .then(timer.rounddown.bind(timer, 'stop'))
                                // Rejected promise skips the following
                                // resolved callbacks.
                                .then(() => fate.state() === 'rejected' &&
                                                fate.promise())
                                .then(pause.bind(null, session.pause))
                                .then($.fn.button.bind(controlButton, 'enable'))
                                .then(timer.rounddown.bind(timer, 'start')));
        // Signal the progress bar to move.
        fate.progress(index => seriesPBar.progressbar({ value: index }));
        $('body').on('keypress', function(e) {
            if (e.key === ' ' || e.key === 'PageDown') {
                // When spacebar or PageDown is pressed, click the unibutton.
                // PageDown is sent by Kensington Wireless Presenter right
                // arrow button.
                controlButton.trigger('click');
            }
        });
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
        for (let p of new URLSearchParams(paramString)) {
            params[p[0]] = p[1];
        }
        // Convert each String value to appropriate type.
        $.each(params, function(name, value) {
            if (options[name]) {
                if (value === 'false') {
                    // Special case for a broken JS type system.  Arghhh!
                    value = false;
                }
                params[name] = options[name].constructor(value);
            } else {
                // Only params defined in this.options may be used in the URL.
                throw new Error('unrecognized URL search parameter');
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
                let label = oneButton.button('option', 'label') ;
                let state = $.grep(this.options.states,
                                      (e, i) => e.text === label)[0];
                $.when()
                    // Temporarily disable button to ignore clicks.
                    .then($.fn.button.bind(oneButton, 'disable'))
                    .then(pause.bind(null, 100))
                    // Call the provided function for the current state.
                    .then(state.func)
                    // Change to next state and enable.
                    .then($.fn.button.bind(oneButton, 'option', 'label', state.next))
                    .then($.fn.button.bind(oneButton, 'enable'));
            }
        });
    }
});
