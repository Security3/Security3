(function(){
  'use strict';
  angular.module('Security3')
    .controller('VerifyController', VerifyController);

  VerifyController.$inject = ['$cordovaImagePicker'];

  function VerifyController($cordovaImagePicker){
    function onUploadSuccess() {
      alert('upload successful');
    }
    function onUploadFail() {
      alert('upload failed');
    }
    var vm = this;
    vm.upload = function () {
      var myImg = vm.imageSrc;
      var options = new FileUploadOptions();
      options.fileKey="file";
      options.fileName=new Date().getTime()+".jpg";
      options.chunkedMode = false;
      options.mimeType = "image/jpeg";
      var ft = new FileTransfer();
      ft.upload(myImg, encodeURI("http://52.211.100.116/verify/"), onUploadSuccess, onUploadFail, options);
    };
    vm.imageSrc = "";
    vm.select = function () {
      var options = {
        maximumImagesCount: 1,
        width: 800,
        height: 800,
        quality: 80
      };

      var cpd = cordova.plugins.diagnostic;

      function success(status) {
        if (cpd.permissionStatus.GRANTED === status) {
          $cordovaImagePicker.getPictures(options).then(function (results) {
            for (var i = 0; i < results.length; i++) {
              vm.imageSrc = results[i];
              console.log('Image URI: ' + results[i]);   // Print image URI
            }
          }, function (error) {
            console.log('Error: ' + JSON.stringify(error));    // In case of error
          });
        } else {
          alert('Allow the requested permission');
        }
      }

      function failure(error) {
        console.log('handle error');
      }

      cpd.requestRuntimePermission(success, failure, cpd.runtimePermission.WRITE_EXTERNAL_STORAGE);
    };
  }
})();

