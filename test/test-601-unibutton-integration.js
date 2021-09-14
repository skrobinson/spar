//
// test-601-unibutton-integration.js
// Copyright 2019 Scottsdale Community College
// written by Sean Robinson <sean.robinson@scottsdalecc.edu>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// QUnit test re-ordering.  true (default) is faster on re-run.
//                          false is more reproducible.
// QUnit.config.reorder = false;


QUnit.module('unibutton to start, pause, and resume');


QUnit.test('keys click button, too', function(assert) {
    let target = $('<div></div>')
        .attr({ 'id': 'target' })
        .appendTo($('#scratch-space'));
    $('#target').spar({
        interval: 10000,
        nrRounds: 1,
        pause: 10,
        sound: false
    });
    let done = assert.async(4);
    let controlButton = $('#control-button').unibutton();
    let timer = $('#timer').rounddown();
    assert.strictEqual(controlButton[0].innerText, 'Begin',
                       'label before first spacebar press');
    assert.strictEqual(timer.rounddown('elapsedTime'), 0,
                       'time before first spacebar press');
    done();
    $('body').simulate('keydown', { keyCode: $.ui.keyCode.SPACE });
    $.when()
        .then(pause(500))
        .then(function() {
            assert.strictEqual(controlButton[0].innerText, 'Pause',
                               'label after first spacebar press');
            assert.ok(timer.rounddown('elapsedTime') > 0,
                      'time before first spacebar press');
            done();
            $('body').simulate('keydown', { keyCode: $.ui.keyCode.SPACE });
        })
        .then(pause(500))
        .then(function() {
            assert.strictEqual(controlButton[0].innerText, 'Resume',
                               'label after second spacebar press');
            done();
            $('body').simulate('keydown', { keyCode: $.ui.keyCode.PAGE_DOWN });
        })
        .then(pause(500))
        .then(function() {
            console.debug(controlButton);
            console.debug(controlButton[0].innerText);
            assert.strictEqual(controlButton[0].innerText, 'Pause',
                               'label after third spacebar press');
            done();
        });
});
