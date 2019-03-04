//
// test-001-create_widget.js
// Copyright 2016, 2018, 2019 Scottsdale Community College
// written by Sean Robinson <sean.robinson@scottsdalecc.edu>
//

// QUnit test re-ordering.  true (default) is faster on re-run.
//                          false is more reproducible.
// QUnit.config.reorder = false;


QUnit.module('create widget');


QUnit.test('initialize a new instance', function(assert) {
    $('#scratch-space').spar();
    assert.notStrictEqual($('#scratch-space').spar('instance'), undefined,
                          'verify widget created');
});
