"use strict";
   
    App.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/index', {
                templateUrl : 'views/site/index.html',
                controller  : 'indexController'
            })
            .when('/about', {
                templateUrl : 'views/site/about.html',
                controller  : 'aboutController'
            })
            .when('/404', {
                templateUrl : 'views/site/404.html',
                controller  : '404Controller'
            })
            .when('/signup', {
                templateUrl : 'views/site/signup.html',
                controller  : 'signupController'
            })
            .when('/forgotPass', {
                templateUrl : 'views/site/forgotPassword.html',
                controller  : 'forgotPassController'
            }) 
            .when('/dashboard', {
                templateUrl : 'views/site/dashboard.html',
                controller  : 'dashBoardController'
            })              
            .when('/login', {
                templateUrl : 'views/site/login.html',
                controller  : 'loginController'
            })
            .when('/changepassword/:token', {
                templateUrl : 'views/site/changePass.html',
                controller  : 'chnagepController'
            })
            .otherwise({
                    redirectTo: '/404'
                });
    });

     App.controller('dashBoardController',['$scope', '$cookieStore', 'site', '$rootScope', function($scope, $cookieStore, site, $rootScope) {
        site.getUser($cookieStore.get('access_token')).then(function successCallback(response){ 
                   $scope.userName = response.data[0].username;
                   $rootScope.user = $scope.userName; 
                   $cookieStore.put('userName', $scope.userName);
        }, function errorCallback(err){
        });      
    }]);

    App.controller('chnagepController',['$scope', 'toastr', 'site', '$routeParams', '$location', function($scope, toastr, site, $routeParams, $location) {
              
               $scope.passChnage = {};
               $scope.changePassButton = true;
               site.changepasswordTokenValidation($routeParams.token).then(function successCallback(response){
                   if(response.data)
                     $scope.changePassButton = false;
                     else
                     $location.path('/login'); 
                     
                }, function errorCallback(error) {
                  console.log(error);
               });
              $scope.submitPassChnageForm = function(isValid) {

                 if(isValid) {
                  if ($scope.passChnage.newPassword == $scope.passChnage.reNewPassword) {
                    site.changepassword($scope.passChnage).then(function successCallback(response) {                                                  
                          if(response.data) {
                           toastr.success('You have successfully changed password, Please now you can login');
                           $location.path('/login');
                          } else toastr.error('Old password is wrong, Please re-enter once again','Error',{ closeButton: true}); 
                       }, function errorCallback(err){
                       });

                  } else toastr.error('New password and re-enter new password must be same!','Error',{ closeButton: true}); 
                 } else toastr.error('Something wrong went with your input box!, Please fill correct inputs','Error',{ closeButton: true}); 
                  
              }
    }]);   
    // create the controller and inject Angular's $scope
    App.controller('indexController',['$scope', function($scope) {

        $scope.message = 'Everyone come and see how good I look!';      

    }]);

    App.controller('forgotPassController',['$scope', 'site', 'toastr', function($scope, site, toastr) {
       
       $scope.forgotPass = {};
        $scope.forgotPassword = function(isValid) {
              if(isValid) {

                 site.forgotPass($scope.forgotPass).then(function successCallback(response) {
                         if(response.data.status == 1) {

                          $scope.forgotPass = {};
                          toastr.success("change password link has been sent to your email, Please use the link and change your password");
                          } else
                          toastr.error('Email id doesn\'t exist!' ,'Error',{ closeButton: true});
                       }, function errorCallback(err){
                         toastr.error('Email id doesn\'t exist!' ,'Error',{ closeButton: true});
                       });

              } else toastr.error('Something wrong went with your input box!, Please fill correct inputs','Error',{ closeButton: true});
        }
    }]);
    
    App.controller('signupController', ['$scope', 'site', '$location', 'toastr', function($scope, site, $location, toastr){
        $scope.signup = {password:"uma"};
            $scope.signupUser = function(isValid) {
                   if (isValid) {
                       site.signup($scope.signup).then(function successCallback(response) {
                          console.log(response.data);
                          if (response.data.status == 200) {
                              toastr.success('Your account has been created successfully, now you can login',{ closeButton: true});
                              $location.path('/login'); 
                          }
                          if(response.data.code == 11000) 
                              toastr.error('User already exist!, Please try with different email id','Error',{ closeButton: true}); 

                       }, function errorCallback(err){

                       });

                   } else toastr.error('Something wrong went with your input box!, Please fill correct inputs','Error',{ closeButton: true});
            }
    }]);

    App.controller('aboutController',['$scope', function($scope) {
        $scope.message = 'Look! I am an about page.';
    }]);


    App.controller('loginController',['$scope','site', '$mdToast', '$location', '$cookieStore', '$rootScope', 'toastr', function($scope, site,  $mdToast, $location, $cookieStore, $rootScope, toastr) {

         $scope.login = {grant_type:'password'};
         $scope.message = 'Contact us! JK. This is just a demo.';
         
        $scope.submitForm = function(isValid) {
                    if (isValid) {
                        site.login($scope.login).then(function successCallback(response) {
                             if(response.data) {
                               $cookieStore.put('access_token', response.data.access_token);
                               $rootScope.logMe = false;
                               $rootScope.signupMe = false;
                               $rootScope.logOutMe = true;
                             $location.path("/dashboard");
                             }  
                        }, function errorCallback(err){
                            if (err.data.code == 400)
                              toastr.error(err.data.error_description,'Error');
                        });
                    } else toastr.error('Something wrong went with your input box!, Please fill correct inputs','Error',{ closeButton: true});
        };
    }]);

    App.controller('404Controller',['$scope', function($scope) {
        $scope.message = 'Page not found 404.';
    }]);