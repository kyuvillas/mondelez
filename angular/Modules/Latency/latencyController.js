app.controller('LatencyController', function ($state,$scope, $interval, $mdDialog, $mdSidenav, ConfigurableItems, DataFactory, $stateParams) {
    $scope.SVG = ConfigurableItems.SVG;
    var name = $stateParams.name;
    console.log(name);
    $scope.latency_details = [];
    $scope.country = '';
    $scope.selected = {
        avg: true,
        lowest: false,
        highest: false
    }

    $scope.goToLatency = function(){
        $state.go('details', { name: $stateParams.name });
    }
   	LoadSystems();
    $scope.dataLoaded = false;
    function LoadSystems() {
        DataFactory.GetLatency(name).then(
            function (response) {
                $scope.dataLoaded = true;
                console.log(response.data[0]);
                $scope.latency_details = response.data[0];
                $scope.latencyvalue = response.data[0].latency;
                var str = $scope.latency_details.location.split(" ");
                $scope.country = str[str.length-1];
                $scope.latency_comp = $scope.analyzeLatency(response.data[0].latency);
                console.log("test", response.data[0].latency);
            },
            function (response) {
                console.log("LoadSystems failed");
                console.log(response);
            });
    }

    //This function computes the average, lowest, and highest latency
    $scope.analyzeLatency = function(data) {
        console.log(data);
        //initialize variables
        var result = {
            "throughput":0,
            "value": [
                {
                    "type":"APP AVAILABILITY",
                    "avg":0,
                    "lowest":0,
                    "highest":0   
                },
                {
                    "type":"PED AVAILABILITY",
                    "avg":0,
                    "lowest":0,
                    "highest":0   
                },
                {
                    "type":"FEP AVAILABILITY",
                    "avg":0,
                    "lowest":0,
                    "highest":0   
                },
                {
                    "type":"LNP AVAILABILITY",
                    "avg":0,
                    "lowest":0,
                    "highest":0   
                },
                {
                    "type":"BRP AVAILABILITY",
                    "avg":0,
                    "lowest":0,
                    "highest":0   
                }
            ]
        };  
        var avg_app=0;
        var avg_brp=0;
        var avg_fep=0;
        var avg_lnp=0;
        var avg_ped=0;
        angular.forEach(data[0].data, function(value, key) {
            avg_app = avg_app + value[1];
        });
        angular.forEach(data[1].data, function(value, key) {
            avg_brp = avg_brp + value[1];
        });
        angular.forEach(data[2].data, function(value, key) {
            avg_fep = avg_fep + value[1];
        });
        // angular.forEach(data[3].data, function(value, key) {
        //     avg_lnp = avg_lnp + value[1];
        // });
        // angular.forEach(data[4].data, function(value, key) {
        //     avg_ped = avg_ped + value[1];
        // });
        // result.throughput = Math.round((data[0].data.length+data[1].data.length+data[2].data.length+data[3].data.length+data[4].data.length)/5);
        result.throughput = Math.round((data[0].data.length+data[1].data.length+data[2])/5);
        result.value[0].avg = (avg_app/data[0].data.length).toFixed(2);
        result.value[1].avg = (avg_brp/data[1].data.length).toFixed(2);
        result.value[2].avg = (avg_fep/data[2].data.length).toFixed(2);
        // result.value[3].avg = (avg_lnp/data[3].data.length).toFixed(2);
        // result.value[4].avg = (avg_ped/data[4].data.length).toFixed(2);
        result.value[0].lowest = data[0].data[data[0].data.length-1][1];
        result.value[1].lowest = data[1].data[data[1].data.length-1][1];
        result.value[2].lowest = data[2].data[data[2].data.length-1][1];
        // result.value[3].lowest = data[3].data[data[3].data.length-1][1];
        // result.value[4].lowest = data[4].data[data[4].data.length-1][1];
        result.value[0].highest = data[0].data[0][1];
        result.value[1].highest = data[1].data[0][1];
        result.value[2].highest = data[2].data[0][1];
        // result.value[3].highest = data[3].data[0][1];
        // result.value[4].highest = data[4].data[0][1];
        console.log(result);
        return result;
    }

    $scope.updateToggle = function(val) {
        if (val == 1){
            $scope.selected.avg = true;
            $scope.selected.lowest = false;
            $scope.selected.highest = false;
        } else if (val == 2) {
            $scope.selected.avg = false;
            $scope.selected.lowest = true;
            $scope.selected.highest = false;
        } else if (val == 3) {
            $scope.selected.avg = false;
            $scope.selected.lowest = false;
            $scope.selected.highest = true;
        }
    }
});