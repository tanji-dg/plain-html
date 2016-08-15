// Bug do ui-router https://github.com/angular-ui/ui-router/issues/105
// deve-se manter $state, $stateParams
export let RunBlock = ($rootScope, $timeout, $window, $ionicPlatform, $state, $stateParams, Session) => {
  'ngInject';
  Session.create();

  var deviceInformation = ionic.Platform.device();
  if (deviceInformation.platform === "browser"){
    $rootScope.isBrowser = true;
  }else{
    $rootScope.isBrowser = false;
  }

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if ($window.cordova && window.cordova.plugins && $window.cordova.plugins.Keyboard) {
      $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      $window.cordova.plugins.Keyboard.disableScroll(true);

    }
    if ($window.StatusBar) {
      // org.apache.cordova.statusbar required
      if (StatusBar) StatusBar.styleDefault();
    }



    if ($window.plugins && $window.plugins.OneSignal) {
      var notificationOpenedCallback = function(jsonData) {
        console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
      };

      $window.plugins.OneSignal.init("26c111f3-a93c-48fb-a572-06567cf9ae92",
        {googleProjectNumber: "703322744261"},
        notificationOpenedCallback);

      // Show an alert box if a notification comes in when the user is in your app.
      $window.plugins.OneSignal.enableInAppAlertNotification(true);

      $window.plugins.OneSignal.getIds(function(ids) {
        document.getElementById("OneSignalUserID").innerHTML = "UserID: " + ids.userId;
        document.getElementById("OneSignalPushToken").innerHTML = "PushToken: " + ids.pushToken;
        console.log('getIds: ' + JSON.stringify(ids));
      });

      $window.plugins.OneSignal.sendTags({name: "Ricardo Paiva", email: "ricardo@ricardopaiva.com"});
    }


  });
};
