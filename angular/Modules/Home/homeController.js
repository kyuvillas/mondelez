app.controller('HomeController', function ($scope, $interval, $mdDialog, $mdSidenav, ConfigurableItems, DataFactory) {
    $scope.SVG = ConfigurableItems.SVG;

    $scope.ostat = 2;
    $scope.ChangeOstat = function (id) {
        $scope.ostat = id;
    }

    $scope.showPopUp = function(app){

        if(app == 'ECC'){
            var div = $('#transform');
            div.toggleClass('new');
            if (div.is(':visible')) {
                div.hide();
            } else {
                div.show();
            }
        }
    }
    $scope.closePopup = function(){
        var div = $('#transform');
            div.toggleClass('new');
            if (div.is(':visible')) {
                div.hide();
            } else {
                div.show();
            }
    }

    $scope.panels = {
        selected: 0
    };
     // $scope.map_data = GetCountries();
     $scope.dataHasLoaded= false;
     GetCountries();
    function GetCountries(){
        DataFactory.GetCountries().then(function(res){
           return  res.data;
        })
        DataFactory.GetCountries().then(
            function (response) {
               $scope.map_data = response.data;
                console.log(response.data);
                 $scope.dataHasLoaded = true;
            });
    }
    $scope.dataLoaded = false;
    LoadSystems();
    function LoadSystems() {
        DataFactory.GetAllLatency().then(
            function (response) {
                $scope.dataLoaded = true;
                $scope.latencyvalue = response.data[0].latency;
            },
            function (response) {
                console.log("LoadSystems failed");
                console.log(response);
            });
    }
    getInfra();
    $scope.infrastructure = [];
    function getInfra(){
        DataFactory.GetInfra().then(function(res){
            $scope.infrastructure = res.data;
        })
    }            
    // SAMPLE DATA //
    // $scope.infrastructure = [
    //     {
    //         parent: 'FEP',
    //         parentStatus: 'AT RISK',
    //         parentColor: 'yellow',
    //         children: [
    //             {
    //                 name: 'DRT (avg. dialog response time)',
    //                 status: 'GOOD',
    //                 statusColor: 'green'
    //             }, {
    //                 name: 'CPU Utilization',
    //                 status: 'GOOD',
    //                 statusColor: 'green'
    //             }, {
    //                 name: 'Memory Utilization',
    //                 status: 'GOOD',
    //                 statusColor: 'green'
    //             }, {
    //                 name: 'SAP WP Stats (total # WP against free)',
    //                 status: 'GOOD',
    //                 statusColor: 'green'
    //             }, {
    //                 name: 'DB Performance (may be avg. db time)',
    //                 status: 'GOOD',
    //                 statusColor: 'green'
    //             }, {
    //                 name: 'DB Tablespace Utilization',
    //                 status: 'GOOD',
    //                 statusColor: 'green'
    //             }
    //         ]
    //     }, {
    //         parent: 'PED',
    //         parentStatus: 'NO DATA',
    //         parentColor: 'gray',
    //         children: [
    //             {
    //                 name: 'DRT (avg. dialog response time)',
    //                 status: 'NO DATA',
    //                 statusColor: 'gray'
    //             }, {
    //                 name: 'CPU Utilization',
    //                 status: 'NO DATA',
    //                 statusColor: 'gray'
    //             }, {
    //                 name: 'Memory Utilization',
    //                 status: 'NO DATA',
    //                 statusColor: 'gray'
    //             }, {
    //                 name: 'SAP WP Stats (total # WP against free)',
    //                 status: 'NO DATA',
    //                 statusColor: 'gray'
    //             }, {
    //                 name: 'DB Performance (may be avg. db time)',
    //                 status: 'GOOD',
    //                 statusColor: 'green'
    //             }, {
    //                 name: 'DB Tablespace Utilization',
    //                 status: 'GOOD',
    //                 statusColor: 'green'
    //             }
    //         ]
    //     }, {
    //         parent: 'DSP',
    //         parentStatus: 'NO DATA',
    //         parentColor: 'gray',
    //         children: [
    //             {
    //                 name: 'CPU Utilization',
    //                 status: 'NO DATA',
    //                 statusColor: 'gray'
    //             }, {
    //                 name: 'Memory Utilization',
    //                 status: 'NO DATA',
    //                 statusColor: 'gray'
    //             }
    //         ]
    //     }, {
    //         parent: 'POP',
    //         parentStatus: 'NO DATA',
    //         parentColor: 'gray',
    //         children: [
    //             {
    //                 name: 'CPU Utilization',
    //                 status: 'NO DATA',
    //                 statusColor: 'gray'
    //             }, {
    //                 name: 'Memory Utilization',
    //                 status: 'NO DATA',
    //                 statusColor: 'gray'
    //             }, {
    //                 name: 'DB Performance (may be avg. db time)',
    //                 status: 'GOOD',
    //                 statusColor: 'green'
    //             }, {
    //                 name: 'DB Tablespace Utilization',
    //                 status: 'GOOD',
    //                 statusColor: 'green'
    //             }
    //         ]
    //     }
    // ];

    $scope.applications = [];
    GetApplications();
    function GetApplications(){
        DataFactory.GetSystemStatus().then(function(res){
            $scope.applications = res.data;
        })
    }
    // $scope.applications = [
    //     {
    //         parent: 'ECC',
    //         brazil: {
    //             status: 'AT RISK',
    //             statusColor: 'yellow'
    //         },
    //         france: {
    //             status: 'CRITICAL',
    //             statusColor: 'red'
    //         }
    //     }
    // ];

    $scope.infraStatus = [
        {
            status: 'GOOD',
            statusColor: 'green'
        }, {
            status: 'AT RISK',
            statusColor: 'yellow'
        }, {
            status: 'CRITICAL',
            statusColor: 'red'
        }, {
            status: 'NO DATA',
            statusColor: 'gray'
        }
    ];
    
    $scope.infraChildrenShowFlag = [];
    for (var i = 0; i < $scope.infrastructure.length; i++) {
        $scope.infraChildrenShowFlag[i] = false;
    }

    $scope.showInfraChildren = function (index) {
        $scope.infraChildrenShowFlag[index] = !$scope.infraChildrenShowFlag[index];
    }

})