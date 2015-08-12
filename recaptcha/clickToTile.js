"use strict";

var RECAPTCHA_GRID_WIDTH = 280;
var RECAPTCHA_GRID_HEIGHT = 392 - 125;
var RECAPTCHA_WIDTH_STEPS = [];
for (var i = 0; i <= 3; i++) {
    RECAPTCHA_WIDTH_STEPS[i] = i * RECAPTCHA_GRID_WIDTH / 3;
}

var RECAPTCHA_HEIGHT_STEPS = [];
for (var i = 0; i <= 3; i++) {
    RECAPTCHA_HEIGHT_STEPS[i] = 125 + i * RECAPTCHA_GRID_HEIGHT / 3;
}

var computeIndexOfClickedTile = function(mouseCoordinates) {
    return computeIndexOfTile(computeClickedTile(mouseCoordinates));
};

var computeClickedTile = function(mouseCoordinates) {
    var tile = {
        x: getColumnForXCoordinate(mouseCoordinates.x) - 1,
        y: getRowForYCoordinate(mouseCoordinates.y) - 1
    };

    return tile;
};

var getColumnForXCoordinate = function(width) {
    for (var i = 0; i < RECAPTCHA_WIDTH_STEPS.length; i++) {
        if (width < RECAPTCHA_WIDTH_STEPS[i]) {
            return i;
        }
    }
};

var getRowForYCoordinate = function(height) {
    for (var i = 0; i < RECAPTCHA_HEIGHT_STEPS.length; i++) {
        if (height < RECAPTCHA_HEIGHT_STEPS[i]) {
            return i;
        }
    }
};

var computeIndexOfTile = function(tile) {
    return 3 * tile.y + tile.x;
};

module.exports = {
    computeIndexOfClickedTile: computeIndexOfClickedTile
};
