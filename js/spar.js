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
