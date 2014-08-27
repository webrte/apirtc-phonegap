## ApiRTC : Phonegap edition

Easy WebRTC made for Cordova & Phonegap apps!

### Features

* Audio & video calls
* Works on Android & iOS
* Chat support
* Demo app

### Requirements

* An ApiRTC server.
* Cordova or Phonegap
* An Android device with Android 4.X or an iDevice (iPhone 5, or +)


### Why apiRTC?

WebRTC requires your own signaling server.
ApiRTC is an easy solution that allows you to build a simple server to interact with your WebRTC app.

On client side, your can use ApiRTC with a Phonegap / Cordova app or a classic Webapp with Chrome / Firefox. 

**WebRTC made simple!**

### How to make your PhoneGap / Cordova app

#### 1 - Deploy your apiRTC server

Deploy your own ApiRTC Community Edition server. You can get it on https://github.com/apizee/apirtc


#### 2 - Make your app

**You can retrieve the following tutorial in the demo folder, in this repository**

First of all, Install Cordova:

    npm install -g cordova ios-deploy
    
Create a new Cordova project:

    cordova create <name>
    cordova platform add ios android

Add the plugin:

	cd <name>
    cordova plugin add https://github.com/apizee/apirtc-phonegap.git


Then, you need to add in your **js** folder **apiRTC.min.js**

Let's go! edit your index.html file in www.


```
<head>
 	<script src="cordova.js"></script>
 	<!-- or if you use phonegap
 		<script src="phonegap.js"></script>
 	-->
    <script src="js/apiRTC.min.js"></script>
</head>
```

ApiRTC is based on number like phone numbers. We have to make an input **#number** to select the destination number.
We add a button named **#call**, to make the call. We add a button called **#hangup** to... hangup.
Then we can add our **#status** div, to watch the progress when signaling. Usefull to debug your app.  

```
    <input type="text" id="number" value="" placeholder="Enter Destination ID"/>
    <input id="call" type="button" value="Call" />
    <input id="hangup" type="button" hidden value="Hangup" />
    <span id="status">Registration Ongoing</span>

```
Then, add you videos (**myRemoteVideo** &  **myMiniVideo**)

```
  	<div id="myRemoteVideo" style="width:640px; height:480px;"></div>
    <video width="30%" height="30%" id="myMiniVideo" autoplay="autoplay"></video>

```

We have the layout, but the logic?

First, you need to modify your  ```body``` tag to ```<body onload="loader()">```

Then, in a ```<script>``` tag, please add the followings:

```
function loader() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
    phonertc = cordova.require('com.apizee.phonertc.PhoneRTC');
}

apiRTC.init({
    ccsServer: "YOUR_SERVER:8000",
    //apiCCId : "1234",	// Your can overide your number
    onReady: sessionReadyHandler
});
```

We have a function named "sessionReadyHandler", called when apiRTC is ready. It's will bind your buttons to apiRTC.

Add the followings:
    
```
 function sessionReadyHandler(e) 
 {
    // Your number : apiCC.session.apiCCId

    apiRTC.addEventListener("incomingCall", incomingCallHandler);
    apiRTC.addEventListener("userMediaError", userMediaErrorHandler);

    var webRTCClient = apiCC.session.createWebRTCClient({
                        minilocalVideo : "myMiniVideo",
                        remoteVideo : "myRemoteVideo",
                        status : "status"
    });

    $("#call").click(function () {
                    $("#call").hide();
                    $("#hangup").show();
                    
                    apiRTC.addEventListener("remoteHangup", remoteHangupHandler);
                    destNumber = $("#number").val();
                    webRTCClient.call(destNumber);
    });

    $("#hangup").click(function () {
                    $("#call").show();
                    $("#hangup").hide();
                    
                    webRTCClient.hangUp();
    });
 }
```

One more thing

```
function incomingCallHandler(e) {
    apiRTC.addEventListener("remoteHangup", remoteHangupHandler);
    $("#call").hide();
    $("#hangup").show();
}
           
function remoteHangupHandler(e) {
    $("#call").show();
    $("#hangup").hide();
}
            
function userMediaErrorHandler(e) {
    $("#call").show();
    $("#hangup").hide();
}
```

##### Building for iOS (optional)

    cordova prepare ios
    
Open the project in Xcode and change the following options in the project settings (these must be changed for both your project and the CordovaLib project):

    Valid Architectures => armv7
    Build Active Architecture Only => No

#### 3 - Let's try!

Install your app on your phone :

```
cordova run android 

```

Then
Goes to your apiRTC server at:

 **http://YOUR_SERVER:8080/sample-clients/apiPhone-level2.html**

### Thanks!
ApiRTC for Phonegap is forked on the [@PhoneRTC](https://github.com/alongubkin/phonertc) project made by:

* [@alongubkin](https://github.com/alongubkin)

* [@egreenmachine](https://github.com/egreenmachine)

* [@joseph-onsip](https://github.com/joseph-onsip)