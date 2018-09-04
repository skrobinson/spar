/*
 * spar jQuery UI Widget
 *
 * A multi-round countdown timer to support in-person exams.
 *
 * @updated August 28, 2018
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
        interval: 60,  // seconds per round (i.e. one mineral)
        pause: 2000,  // hidden delay between rounds, in milliseconds
        nrRounds: 25,  // number of countdowns to show
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
        let options = this.options;
        let timer = this.options.timer;
        // Fate is resolved at the end (of the progressbar count down)
        // and notifies progress listeners about the end of each round.
        let fate = $.Deferred();
        let currentRound = 0;
        // Save a partial function to return text for the progress bar.
        let updateLabel = remainderText(options.nrRounds);
        let seriesLabel = $('#rounds-counter > .progress-label');
        // Create a countdown timer to measure time for each pair of questions.
        timer = $('#timer').rounddown(
                            $.extend(
                                {seconds: options.interval,
                                 onComplete: () => fate.notify(++currentRound) },
                                options.timerOpts
                            ));
        // Start the timer to draw it on-screen, then immediately stop it.
        timer.start();
        timer.stop();
        // Once things settle, resize the countdown to fit screen.
        $.when(pause(10))
            .then(() => [$('#timer').parent().innerHeight(),
                         $('#timer').parent().innerWidth()])
            .then(dims => Math.min.apply(null, dims))
            .then(minDim => timer.radius(minDim / 2.2));
        // Create a progress bar for the entrire exam length.
        let seriesPBar = $('#rounds-counter').progressbar({
            change: () => seriesLabel.text(updateLabel(currentRound)),
            complete: () => fate.reject('complete'),
            max: options.nrRounds,
            value: 0
        });
        // Create a Begin-Pause-Resume button.
        let buttonStates = [
            {
                text: 'Begin',
                next: 'Pause',
                func: timer.start.bind(timer)
            },
            {
                text: 'Pause',
                next: 'Resume',
                func: timer.pause.bind(timer)
            },
            {
                text: 'Resume',
                next: 'Pause',
                func: timer.resume.bind(timer)
            }
        ];
        let controlButton = $('#control-button').unibutton({
            states: buttonStates
        });
        // Set to begin at round 0.
        seriesLabel.text(updateLabel(0));
        // Play a bell sound at the end of each round.
        // The audio object is the first item in the jQuery object collection.
        fate.progress(() => $('#sound-bell')[0].play());
        // Stop the timer for options.pause milliseconds after each round.
        // The hidden pause gives time for students to physically pass samples.
        fate.progress(() => $.when()
                                .then($.fn.button.bind(controlButton, 'disable'))
                                .then(timer.stop.bind(timer))
                                // Rejected promise skips the following
                                // resolved callbacks.
                                .then(() => fate.state() === 'rejected' &&
                                                fate.promise())
                                .then(pause.bind(null, options.pause))
                                .then($.fn.button.bind(controlButton, 'enable'))
                                .then(timer.start.bind(timer)));
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
