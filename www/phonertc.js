var exec = require('cordova/exec');

var videoElements;
var lastVideoParams;
var videoParams;
var handle;
exports.updateVideoPosition = function () {
    // This function should listen for scrolling and update the position of the elements to cordova exec
    if (videoElements) {
        videoParams = {
            localVideo: getLayoutParams(videoElements.localVideo),
            remoteVideo: getLayoutParams(videoElements.remoteVideo)
        };

        if(JSON.stringify(lastVideoParams)!==JSON.stringify(videoParams))
        {
            //Make invisible
            videoElements.localVideo.style.opacity=0;
            videoElements.remoteVideo.style.opacity=0;
            
            lastVideoParams=videoParams;
            // Update Video Element positioning
            exec(
                null,
                null,
                'PhoneRTCPlugin',
                'updateVideoPosition',
                [videoParams]);
        }
    }
};

document.addEventListener("touchmove", exports.updateVideoPosition);

function getLayoutParams (videoElement) {
    var boundingRect = videoElement.getBoundingClientRect();
    return {
        // get these values by doing a lookup on the dom
        x : boundingRect.left + window.scrollX,
        y : boundingRect.top + window.scrollY,
        width : videoElement.offsetWidth,
        height : videoElement.offsetHeight,
        devicePixelRatio: window.devicePixelRatio || 2,
    };
}

exports.setVideoElements = function (localVideo, remoteVideo) {

    console.log("setVideoElements");

    videoElements = {
        localVideo: localVideo,
        remoteVideo: remoteVideo
    };   

};


exports.call = function (options) {
    // options should contain a video option if video is enabled
    // sets the initial video options a dom listener needs to be added to watch for movements.
    var video;
    if (options.video) {
        videoElements = {
            localVideo: options.video.localVideo,
            remoteVideo: options.video.remoteVideo
        };
        video = {
            localVideo: getLayoutParams(videoElements.localVideo),
            remoteVideo: getLayoutParams(videoElements.remoteVideo)
        };
    }

    handle = window.setInterval(function(){

        exports.updateVideoPosition();

    }, 40);

    exec(
        function (data) {
            if (data.type === '__ready' && options.readyCallback) {
                options.readyCallback();
            }
            else if (data.type === '__answered' && options.answerCallback) {
                options.answerCallback();
            } else if (data.type === '__disconnected' && options.disconnectCallback) {
                options.disconnectCallback();
            } else {
                options.sendMessageCallback(data);
            }
        },
        null,
        'PhoneRTCPlugin',
        'call',
        [options.isInitator, options.turn.host, options.turn.username, options.turn.password, video]);
};

exports.setEnabledMedium = function (mediumType, enabled) {
    exec(
        function () {},
        null,
        'PhoneRTCPlugin',
        'setEnabledMedium',
        [mediumType, enabled]);
}

exports.receiveMessage = function (data) {
    exec(
        null,
        null,
        'PhoneRTCPlugin',
        'receiveMessage',
        [JSON.stringify(data)]);
};

exports.updateOrientation = function (orientation) {
    exec(
        null,
        null,
        'PhoneRTCPlugin',
        'updateOrientation',
        [orientation]);
};

exports.disconnect = function () {
    exec(
        null,
        null,
        'PhoneRTCPlugin',
        'disconnect',
        []);
    window.clearInterval(handle);
};
