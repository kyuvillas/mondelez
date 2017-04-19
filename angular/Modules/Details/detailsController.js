// app.controller('DetailsController', function ($state, $stateParams, $scope, $interval, $mdDialog, $mdSidenav, ConfigurableItems, DataFactory) {
//     $scope.phases = ['PRE', 'IN', 'POST'];

//     $scope.PRE = [];
//     $scope.IN = [];
//     $scope.POST = [];

//     getProcesses();

//     function getProcesses() {
//         DataFactory.GetProcesses().then(function(res) {
//             console.log(res.data);
//             $scope.processes = res.data;

//             for (var i = 0; i < $scope.processes.PRE.length; i++)
//                 $scope.PRE[i] = false;
            
//             for (var i = 0; i < $scope.processes.IN.length; i++)
//                 $scope.IN[i] = false;
            
//             for (var i = 0; i < $scope.processes.POST.length; i++)
//                 $scope.POST[i] = false;
//         })
//     }

//     $scope.goToLatency=  function () { 
//     	$state.go('latency', { name: $stateParams.name });
//     }

//     $scope.showFlag = function(index, phase) {
//         $scope[phase][index] = !$scope[phase][index];
//     }
// })

app.controller('DetailsController', function ($state, $stateParams, $scope, $interval, $mdDialog, $mdSidenav, ConfigurableItems, DataFactory) {
    $scope.phases = ['PRE', 'IN', 'POST'];

    $scope.PRE = [];
    $scope.IN = [];
    $scope.POST = [];

    $scope.systems = ['SFDC', 'Vendavo', 'ECC', 'FSCM', 'IBP', 'PECSyn'];

    getProcesses();

    function getProcesses() {
        DataFactory.GetProcesses().then(function(res) {
            console.log(res.data);
            $scope.processes = res.data;

            for (var i = 0; i < $scope.processes.PRE.length; i++)
                $scope.PRE[i] = false;
            
            for (var i = 0; i < $scope.processes.IN.length; i++)
                $scope.IN[i] = false;
            
            for (var i = 0; i < $scope.processes.POST.length; i++)
                $scope.POST[i] = false;
        })
    }

    $scope.goToLatency=  function () { 
        $state.go('latency', { name: $stateParams.name });
    }

    $scope.showFlag = function(index, phase) {
        $scope[phase][index] = !$scope[phase][index];
    }
})