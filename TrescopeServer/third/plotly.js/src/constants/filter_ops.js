/**
* Copyright 2012-2021, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

'use strict';

module.exports = {
    COMPARISON_OPS: ['=', '!=', '<', '>=', '>', '<='],
    COMPARISON_OPS2: ['=', '<', '>=', '>', '<='],
    INTERVAL_OPS: ['[]', '()', '[)', '(]', '][', ')(', '](', ')['],
    SET_OPS: ['{}', '}{'],
    CONSTRAINT_REDUCTION: {
        // for contour constraints, open/closed endpoints are equivalent
        '=': '=',

        '<': '<',
        '<=': '<',

        '>': '>',
        '>=': '>',

        '[]': '[]',
        '()': '[]',
        '[)': '[]',
        '(]': '[]',

        '][': '][',
        ')(': '][',
        '](': '][',
        ')[': ']['
    }
};
