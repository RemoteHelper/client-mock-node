"use strict";

var gridClickStatus = [];

for (var i = 0; i < 9; i++) {
    gridClickStatus[i] = false;
}

var toggle = function(index) {
    gridClickStatus[index] = !gridClickStatus[index];
};

module.exports = {
    toggle: toggle,
    map: gridClickStatus.map.bind(gridClickStatus)
};
