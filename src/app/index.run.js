// Bug do ui-router https://github.com/angular-ui/ui-router/issues/105
// deve-se manter $state, $stateParams
export let RunBlock = ($rootScope, $timeout, $window, $ionicPlatform, $ionicPopup, $log,
                       $state, $stateParams, Session) => {
  'ngInject';
  Session.create();


  $ionicPlatform.ready(function() {
    $rootScope.isBrowser = $window.ionic && $window.ionic.Platform && $window.ionic.Platform.platforms && $window.ionic.Platform.platforms.indexOf('browser') > -1;
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if ($window.cordova && $window.cordova.plugins && $window.cordova.plugins.Keyboard) {
      $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      $window.cordova.plugins.Keyboard.disableScroll(true);

    }
    if ($window.StatusBar) {
      $window.StatusBar.styleDefault();
    }

    var deploy = new $window.Ionic.Deploy();
    deploy.watch().then(function() {}, function() {}, function(updateAvailable) {
      if (updateAvailable) {
        deploy.download().then(function() {
          deploy.extract().then(function() {
            // deploy.unwatch();
            $ionicPopup.show({
              title: 'Atualização Disponível',
              subTitle: 'Uma nova atualização acabou de ser instalada. Gostaria de reiniciar o sistema para carregar as novas funcionalidades?',
              buttons: [
                { text: 'Agora não' },
                {
                  text: 'Sim',
                  onTap: function() {
                    deploy.load();
                  }
                }
              ]
            });
          });
        });
      }
    });


    if ($window.plugins && $window.plugins.OneSignal) {
      var notificationOpenedCallback = function(jsonData) {
        $log('didReceiveRemoteNotificationCallBack: ', jsonData);
      };

      $window.plugins.OneSignal.init("26c111f3-a93c-48fb-a572-06567cf9ae92",
        {googleProjectNumber: "703322744261"},
        notificationOpenedCallback);

      // Show an alert box if a notification comes in when the user is in your app.
      $window.plugins.OneSignal.enableInAppAlertNotification(true);

      $window.plugins.OneSignal.getIds(function(ids) {
        // document.getElementById("OneSignalUserID").innerHTML = "UserID: " + ids.userId;
        // document.getElementById("OneSignalPushToken").innerHTML = "PushToken: " + ids.pushToken;
        $log('getIds: ', ids);
      });

      $window.plugins.OneSignal.sendTags({name: "Ricardo Paiva", email: "ricardo@ricardopaiva.com"});
    }


  });
};
