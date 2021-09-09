//
// test-080-unibutton.js
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


QUnit.module('unibutton for state changes');


QUnit.test('create', function(assert) {
    let buttonStates = [
        {
            text: 'First',
            next: 'First',
            func: () => null
        }
    ];
    $('#scratch-space').unibutton({ states: buttonStates });
    assert.notStrictEqual($('#scratch-space').unibutton('instance'), undefined,
                          'verify button created');
});

QUnit.test('fail to create', function(assert) {
    assert.throws(function () {
                      $('#scratch-space').unibutton();
                  },
                  new Error('A unibutton must have at least one state.'),
                  'button creation requires states');
});

QUnit.test('click between states', function(assert) {
    let clickCount = 0;
    let buttonStates = [
        {
            text: 'Begin',
            next: 'Continue',
            func: () => clickCount++
        },
        {
            text: 'Continue',
            next: 'Begin',
            func: () => clickCount++
        }
    ];
    let target = $('<div></div>')
        .attr({ 'id': 'target' })
        .appendTo($('#scratch-space'));
    let done = assert.async(3);
    $('#target').unibutton({ states: buttonStates });
    assert.strictEqual(clickCount, 0, 'before first click');
    $('#target').trigger('click');
    $.when()
        .then(pause(500))
        .then(function() {
            assert.strictEqual(clickCount, 1, 'after one click');
            done();
            $('#target').trigger('click');
        })
        .then(pause(500))
        .then(function() {
            assert.strictEqual(clickCount, 2, 'after two clicks');
            done();
            $('#target').trigger('click');
        })
        .then(pause(500))
        .then(function() {
            assert.strictEqual(clickCount, 3, 'after three clicks');
            done();
        });
});
