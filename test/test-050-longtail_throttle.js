//
// test-050-longtila-throttle.js
// Copyright 2017, 2018 Scottsdale Community College
// written by Sean Robinson <sean.robinson@scottsdalecc.edu>
//

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
