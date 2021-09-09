//
// test-050-longtila-throttle.js
// Copyright 2017, 2018 Scottsdale Community College
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


QUnit.module('longtail throttle');


QUnit.test('test throttling', function(assert) {
    var done = assert.async(2);
    var target = $('<div></div>')
        .attr({
            'id': 'target'
        })
        .appendTo($('#scratch-space'));
    var initCounter = 0;
    var reactCounter = 0;
    var interval = 100;
    var tail = 3;
    // Count fired events.
    $('#scratch-space').on('plumsul-test-resize-init', function() {
        initCounter++;
    });
    $(window).on('plumsul-test-resize-react', function() {
        reactCounter++;
    });
    longtailThrottle('plumsul-test-resize-init', 'plumsul-test-resize-react');
    // Send the first event.
    target.trigger('plumsul-test-resize-init');
    // Check event counts after enough time has passed.
    setTimeout(function() {
        assert.strictEqual(initCounter, 1, 'inciter fired once');
        done();
        assert.strictEqual(reactCounter, 3, 'responder fired thrice');
        done();
        // Turn off longtailThrottle listener between tests.
        $(window).off('plumsul-test-resize-init');
    }, interval * tail * 2);
});

QUnit.test('test resetting tailCounter', function(assert) {
    var done = assert.async(2);
    var target = $('<div></div>')
        .attr({
            'id': 'target'
        })
        .appendTo($('#scratch-space'));
    var initCounter = 0;
    var reactCounter = 0;
    var interval = 100;
    var tail = 3;
    // Count fired events.
    $('#scratch-space').on('plumsul-test-resize-init', function() {
        initCounter++;
    });
    $(window).on('plumsul-test-resize-react', function() {
        reactCounter++;
    });
    longtailThrottle('plumsul-test-resize-init', 'plumsul-test-resize-react');
    // Send the first event.
    target.trigger('plumsul-test-resize-init');
    // Send a second event to reset the responder event count.
    setTimeout(function() {
        target.trigger('plumsul-test-resize-init');
    }, interval + tail);
    // Check event counts after enough time has passed.
    setTimeout(function() {
        assert.strictEqual(initCounter, 2, 'inciter fired twice');
        done();
        assert.strictEqual(reactCounter, 4, 'responder fired four times');
        done();
        // Turn off longtailThrottle listener between tests.
        $(window).off('plumsul-test-resize-init');
    }, interval * tail * 2);
});
