//
// test-021-pause.js
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


QUnit.module('pause in a Promise chain');


QUnit.test('quickly resolved', async assert => {
    assert.expect(1);
    let done = assert.async();
    let value = 'SCC';
    $.when(value)
        .then(pause(0))
        .then(function(newValue) {
            assert.equal(newValue, value, 'Promise resolved with value');
            done();
        });
});

QUnit.test('slowly resolved', async assert => {
    assert.expect(1);
    let done = assert.async();
    let value = 'SCC';
    $.when(value)
        .then(pause(100))
        .then(function(newValue) {
            assert.equal(newValue, value, 'Promise resolved with value');
            done();
        });
});
