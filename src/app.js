angular.module('AudioTrackr', [])
.config(function() {
    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
});
