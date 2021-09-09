//
// test-020-remainder-text.js
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


QUnit.module('generate various label functions');


QUnit.test('usual labels', function(assert) {
    assert.expect(3);
    let label = remainderText(25);
    assert.equal(label(0), '25 rounds remaining', 'start of session');
    assert.equal(label(23), '2 rounds remaining', 'near end of session');
    assert.equal(label(25), '0 rounds remaining', 'round completing');
});

QUnit.test('singular suffix for singular round', function(assert) {
    assert.expect(4);
    let label = remainderText(25);
    assert.equal(label(22), '3 rounds remaining', 'multiple remaining rounds');
    assert.equal(label(23), '2 rounds remaining', 'multiple remaining rounds');
    assert.equal(label(24), '1 round remaining', 'singular remaining round');
    assert.equal(label(25), '0 rounds remaining', 'no remaining rounds');
});

QUnit.test('differing labels', function(assert) {
    assert.expect(3);
    let label = remainderText(2);
    assert.equal(label(0), '2 rounds remaining', 'near end of session');

    label = remainderText(100);
    assert.equal(label(0), '100 rounds remaining', 'start of session');
    assert.equal(label(100), '0 rounds remaining', 'round completing');
});
