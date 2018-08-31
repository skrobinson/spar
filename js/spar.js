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
