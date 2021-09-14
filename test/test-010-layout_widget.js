//
// test-010-layout_widget.js
// Copyright 2016, 2018, 2019 Scottsdale Community College
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
