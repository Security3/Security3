/**
 * http://usejsdoc.org/
 */

/*function Controller ( $scope )
{
	$scope.myVar = "test";

}*/

angular.module('Security3Server',['ngResource']).controller('Controller', function($scope, $resource, $interval){
	$interval(function() {
		var imageList = $resource("http://52.211.100.116/upload");
		imageList = imageList.query();
		var promise = imageList.$promise;
		promise.then(function(list){
			$scope.imageList = list;
		});
		var verifyImageList = $resource("http://52.211.100.116/verify");
		verifyImageList = verifyImageList.query();
		var verifyPromise = verifyImageList.$promise;
		verifyPromise.then(function(list){
			$scope.verifyImageList = list;
		});

		var blockChain = $resource("http://52.211.100.116/blockchain").query().$promise.then(function(blocks){
			$scope.blockChain = blocks;
		});
	}, 1000);
});


