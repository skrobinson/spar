//
// test-010-layout_widget.js
// Copyright 2016, 2018, 2019 Scottsdale Community College
// written by Sean Robinson <sean.robinson@scottsdalecc.edu>
//

// QUnit test re-ordering.  true (default) is faster on re-run.
//                          false is more reproducible.
// QUnit.config.reorder = false;


QUnit.module('layout widget');


QUnit.test('test that the overall layout is readied', function(assert) {
    $('#scratch-space').spar();

    assert.strictEqual($('#timer > canvas').length, 1,
                       'check timer canvas is ready');
    assert.strictEqual($('#rounds-counter').length, 1,
                       'check rounds progress bar is ready');
    assert.strictEqual($('#controls').length, 1,
                       'check controls are ready');
});
