/**
 * http://usejsdoc.org/
 */

/*function Controller ( $scope )
{
	$scope.myVar = "test";

}*/

angular.module('Security3Server',['ngResource']).controller('Controller', function($scope, $resource){
	$scope.myVar = 4;
	var imageList = $resource("http://52.211.100.116/upload");
	imageList = imageList.query();
	var promise = imageList.$promise;
	promise.then(function(list){
		$scope.imageList = list;
	});
});


