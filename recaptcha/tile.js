"use strict";

var gridClickStatus = require('./gridClickStatus');
var computeIndexOfClickedTile = require('./clickToTile').computeIndexOfClickedTile;

var click = function(mouseCoordinates) {
    gridClickStatus.toggle(computeIndexOfClickedTile(mouseCoordinates));
};

var toRecaptchaImageIdentifier = function() {
    return parseInt(gridClickStatus.map(function(isTileClicked) {
        return isTileClicked ? '1' : '0';
    }).reverse().join(''), 2);
};

module.exports = {
    click: click,
    toImageIdentifier: toRecaptchaImageIdentifier
};
