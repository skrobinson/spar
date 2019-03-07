//
// test-021-pause.js
// Copyright 2019 Scottsdale Community College
// written by Sean Robinson <sean.robinson@scottsdalecc.edu>
//

// QUnit test re-ordering.  true (default) is faster on re-run.
//                          false is more reproducible.
// QUnit.config.reorder = false;


QUnit.module('pause in a Promise chain');


QUnit.test('quickly resolved', async assert => {
    assert.expect(1);
    let promise = pause(0);
    await promise;
    assert.equal(promise.state(), 'resolved', 'Promise resolved');
});

QUnit.test('slowly resolved', async assert => {
    assert.expect(1);
    let promise = pause(100);
    await promise;
    assert.equal(promise.state(), 'resolved', 'Promise resolved');
});
