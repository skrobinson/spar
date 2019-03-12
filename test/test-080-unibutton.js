//
// test-080-unibutton.js
// Copyright 2019 Scottsdale Community College
// written by Sean Robinson <sean.robinson@scottsdalecc.edu>
//

// QUnit test re-ordering.  true (default) is faster on re-run.
//                          false is more reproducible.
// QUnit.config.reorder = false;


QUnit.module('unibutton to start, pause, and resume');


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
        .then(pause.bind(null, 200))
        .then(function() {
            assert.strictEqual(clickCount, 1, 'after one click');
            done();
            $('#target').trigger('click');
        })
        .then(pause.bind(null, 200))
        .then(function() {
            assert.strictEqual(clickCount, 2, 'after two clicks');
            done();
            $('#target').trigger('click');
        })
        .then(pause.bind(null, 200))
        .then(function() {
            assert.strictEqual(clickCount, 3, 'after three clicks');
            done();
        });
});
