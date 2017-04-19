/* Factory */
var hudFactory = angular.module('HUD-Factory', []); //
hudFactory.config(['$httpProvider', function ($httpProvider) {
    //Reset headers to avoid OPTIONS request (aka preflight)
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
}]);
hudFactory.factory('DataFactory', ['$http', 'ConfigurableItems', function ($http, config) {
    var isLocalhost = (window.location.origin != "https://syngenta-monitoring.azurewebsites.net"); //Temporary!
    var targetEndpoint = isLocalhost ? "../index.php/" : "http://cloudpipe-syngenta.azurewebsites.net/http/c4w19842.itcs.hpecorp.net/Syngenta-Monitors/index.php/";

    var str = "localhost:8080/carlo/";
    return {
        //Samples
        SampleGET: function () {
            return $http({
                url: "url/sampleget",
                method: 'GET'
            });
        },
        SamplePOST: function (obj) {
            return $http({
                method: "POST",
                url: "url/samplepost",
                data: obj,
            });
        },
        GetLatency: function ($country) {
            return $http({
                method: "GET",
                url: targetEndpoint + "controller_ds/getLatencyData?name="+$country
            });
        },
        GetAllLatency: function () {
            return $http({
                method: "GET",
                url: ""
            });
        },
        GetCountries: function () {
            return $http({
                method: "GET",
                url: "json/countries.json"
            });
        },
        GetProcesses: function () {
            return $http({
                method: "GET",
                url:  "controller_ds/getProcesses"
            });
        },GetInfra: function () {
            return $http({
                method: "GET",
                url:  "json/kpi.json"
            });
        },GetSystemStatus: function () {
            return $http({
                method: "GET",
                url:  "json/systems.json"
            });
        }
    }
}]);
