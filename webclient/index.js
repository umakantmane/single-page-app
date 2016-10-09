"use strict";
var jq = $.noConflict();

var App = angular.module('soonApp', ['ngRoute', 'ngMaterial', 'ngCookies', 'ngAnimate', 'toastr']);

App.run(function($rootScope, $mdDialog, $location, $cookieStore) {


 $rootScope.openmD = function(event) {
            
 $mdDialog.show({
                  clickOutsideToClose: true,
                  scope:$rootScope,        
                  preserveScope: true,           
                  template: '<md-dialog>' +
                              '  <md-dialog-content>' +
                              '     Welcome to TutorialsPoint.com' +
                              '  </md-dialog-content>' +
                              '</md-dialog>',
                  controller: function DialogController($scope, $mdDialog) {
                     $scope.closeDialog = function() {
                        $mdDialog.hide();
                     }
                  }
               });

        }

        if($cookieStore.get('access_token') == undefined) {
          $rootScope.logMe = true;
          $rootScope.signupMe = true;
          $rootScope.logOutMe = false;
        } else   {
          $rootScope.logMe = false;
          $rootScope.signupMe = false;
          $rootScope.logOutMe = true;
          $rootScope.user = $cookieStore.get('userName');
        }

        $rootScope.logout = function() {
              $cookieStore.remove('access_token');
              $rootScope.logMe = true;
              $rootScope.signupMe = true;
              $rootScope.logOutMe = false;
              $location.path('/login');
        }
        
   $rootScope.$on('$routeChangeStart', function(evt, absNewUrl, absOldUrl) {
        //   console.log('success', absOldUrl.templateUrl);
         if ($cookieStore.get('access_token') == undefined && $location.path() == '/dashboard') {
               $location.path('/login');
         } else if($cookieStore.get('access_token') != undefined && ($location.path() == '/signup' || $location.path() == '/login')) {
             $location.path('/dashboard');
         }

  }); 
});