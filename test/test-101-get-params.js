//
// test-101-get-params.js
// Copyright 2019 Scottsdale Community College
// written by Sean Robinson <sean.robinson@scottsdalecc.edu>
//

// QUnit test re-ordering.  true (default) is faster on re-run.
//                          false is more reproducible.
// QUnit.config.reorder = false;


QUnit.module('check search parameter conversion');


QUnit.test('verify working URLSearchParams', function(assert) {
    $('#scratch-space').spar();
    let mockParams = '?interval=9000&nrRounds=20';
    let expected = {
        interval: 9000,
        nrRounds: 20
    };
    let processed = $('#scratch-space').spar('getParams', mockParams);
    assert.deepEqual(processed, expected,
                     'processed params match expected object');
});

QUnit.test('verify a variety of params', function(assert) {
    $('#scratch-space').spar();
    let mockParams = '?F=false&integer=90&number=3.14&string=go%20%27chokes&T=true';
    let expected = {
        F: false,
        integer: 90,
        number: 3.14,
        string: "go 'chokes",
        T: true
    };
    // getParams will ignore parameters it cannot match to widget options,
    // so insert options with the types we want to test.
    let typeSamples = {
        F: false,
        integer: 1,
        number: 2.718,
        string: "SCC",
        T: false
    };
    $('#scratch-space').spar('option', typeSamples);
    let processed = $('#scratch-space').spar('getParams', mockParams);
    assert.deepEqual(processed, expected,
                     'processed params match expected object');
});

QUnit.test('verify unknown URLSearchParams are logged', function(assert) {
    $('#scratch-space').spar();
    let mockParams = '?interval=9000&rounds=20';
    let expected = {
        interval: 9000
    };
    let inQueue = [];
    let expectedQueue = ['unrecognized URL search parameter:', 'rounds'];
    // Temporarily monkeypatch the console.warn function.
    let savedWarn = console.warn;
    console.warn = function() {
        inQueue.push(...arguments);
    }
    let processed = $('#scratch-space').spar('getParams', mockParams);
    console.warn = savedWarn;
    assert.deepEqual(processed, expected,
                     'processed params match expected object');
    assert.deepEqual(inQueue, expectedQueue,
                     'unrecognized params are logged to console');
});
