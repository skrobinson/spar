/*
 * spar jQuery UI Widget
 *
 * A multi-round countdown timer to support in-persons exams.
 *
 * @updated August 28, 2018
 * @version Talc
 *
 * @author Sean Robinson <sean.robinson@scottsdalecc.edu>
 * @copyright (c) 2018 Scottsdale Community College
 */

'use strict';

$.widget('scottsdalecc.spar', {
    options: {
        interval: 60,  // seconds per round (i.e. one mineral)
        pause: 2,  // hidden delay between rounds
        rounds: 25,  // number of countdowns to show
        sound: true,  // play sounds ending each round
        // Defaults for rounddown appearance
        timerOpts: {
            autostart: false,
            fillStyle: '#FFFFFF',  // solid white interior
            fontColor: '#000000',  // black text
            label: ['second', 'seconds'],
            radius: 52,
            smooth: true,
            strokeStyle: '#000000',  // border color
            strokeWidth: 5  // border width
        }
    },

    _create: function() {
    }
});
