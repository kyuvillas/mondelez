/* DIRECTIVES */
var hudDirectives = angular.module('HUD-Directives', ['HUD-Factory']); //
hudDirectives.directive('ngRightClick', function ($parse) {
    return function (scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function (event) {
            scope.$apply(function () {
                event.preventDefault();
                fn(scope, { $event: event });
            });
        });
    };
});
hudDirectives.directive("hudMainStyles", function () {
    return {
        restrict: 'E',
        templateUrl: "angular/CSSTemplates/hudMainStyles.html"
    }
});
hudDirectives.directive("hudSetter", function () {
    return {
        restrict: 'A',
        scope: {
            heightInPercent: '=',
            widthInPercent: '=',
            minheightInPercent: '=',
            minwidthInPercent: '=',
            fontInPercent: '=',
            margin: '=',
            padding: '='
        },
        replace: true,
        link: function (scope, element, attrs) {
            if (scope.heightInPercent !== undefined) {
                $(element[0]).css("height", scope.heightInPercent.toString() + "%");
            }
            if (scope.widthInPercent !== undefined) {
                $(element[0]).css("width", scope.widthInPercent.toString() + "%");
            }
            if (scope.minheightInPercent !== undefined) {
                $(element[0]).css("min-height", scope.minheightInPercent.toString() + "%");
            }
            if (scope.minwidthInPercent !== undefined) {
                $(element[0]).css("min-width", scope.minwidthInPercent.toString() + "%");
            }
            if (scope.fontInPercent !== undefined) {
                $(element[0]).css("font-size", scope.fontInPercent.toString() + "%");
            }
            if (scope.margin !== undefined) {
                $(element[0]).css("margin", scope.margin);
            }
            if (scope.padding !== undefined) {
                $(element[0]).css("padding", scope.padding);
            }
        }
    }

});
/* Highcharts */
hudDirectives.directive("highMaps", function (ConfigurableItems, $http, $state) {
    return {
        restrict: 'E',
        scope: {
            click: "=",
            toggleLoad: "=",
            backOneLevel: "=",
            changeMapState: "=",
            mapdata: "="
        },
        link: function (s, e, a) {
            console.log(s.mapdata);
            var mapdata = s.mapdata;
            s.ChangeMapState = function (st) {
                s.state = st;
                $.getScript("https://code.highcharts.com/mapdata/" + s.mapKey + '.js').done(function (script, status) {
                    s.InitializeMap();
                });
            }

            s.state = "marker";
            s.loadState = true;
            s.Map = {};
            s.data = [];
            s.mapKey = "custom/world";
            s.mapGeoJSON = Highcharts.maps[s.mapKey];
            s.breadcrumb = [];
            s.breadcrumb.push(s.mapKey);

            //Map Initializer
            s.InitializeMap = function () {
                s.loadState = true;
                s.mapGeoJSON = Highcharts.maps[s.mapKey];
                s.data = [];

                if (s.state == "heatmap") {
                    s.data = LoadHeatmapData(s.mapKey);
                } else {
                    angular.forEach(s.mapGeoJSON.features, function (feature) {
                        s.data.push({
                            key: feature.properties['hc-key'],
                        });
                    })
                }

                var series = [];
                series.push(InitializeBasemapSeries(s.data));

                
                        if (s.state == "marker") {
                            var data = [];
                            angular.forEach(mapdata, function (o, i) {
                                if (o.type.indexOf(s.mapKey) != -1) {
                                    o.id = i;
                                    data.push(o);
                                }
                            })
                            series.push({
                                type: 'mappoint',
                                name: 'Cities',
                                color: 'rgba(1, 169, 130, 0.9)',
                                marker: {
                                    lineColor: 'white',
                                    lineWidth: 1,
                                },
                                data: data
                            });
                            // console.log(series);
                        }

                        s.Map = e.highcharts('Map', {
                            chart: {
                                backgroundColor: "transparent",
                                style: {
                                    fontFamily: "Roboto",
                                    size: "20px"
                                }
                            },
                            colorAxis: {
                                min: 0,
                                stops: [
                                    [0, 'rgba(216, 219, 213,.6)'],
                                    // [0.5, 'rgba(1, 169, 130,0.2)'],
                                    [1, 'rgba(139,0,0,.9)']
                                ]
                            },
                            credits: {
                                enabled: false
                            },
                            exporting: {
                                enabled: false
                            },
                            legend: {
                                enabled: false,
                                title: {
                                    text: 'Population density per km²'
                                }
                            },
                            mapNavigation: {
                                enabled: true,
                                enableDoubleClickZoomTo: false,
                                enableDoubleClickZoom: false,
                                enableTouchZoom: true,
                                buttonOptions: {
                                    style: {
                                        color: 'rgba(98, 110, 111, 1)'
                                    },
                                    theme: {
                                        fill: 'rgba(21, 33, 35, .8)',
                                        'stroke-width': 1,
                                        stroke: 'rgba(70, 81, 82, 1)',
                                        r: 5,
                                        states: {
                                            hover: {
                                                fill: 'rgba(67, 94, 98, 1)',
                                                stroke: 'rgba(255, 255, 255, .4)',
                                                style: {
                                                    color: 'rgba(255, 255, 255, .8)'
                                                }
                                            },
                                            select: {
                                                stroke: '#039',
                                                fill: 'rgba(21, 33, 35, .8)',
                                                style: {
                                                    color: 'rgba(98, 110, 111, 1)'
                                                }
                                            }
                                        }
                                    },
                                    verticalAlign: 'top',
                                    align: 'left'
                                },
                            },
                            loading: {
                                hideDuration: 1000,
                                showDuration: 1000,
                                labelStyle: {
                                    color: 'white',
                                    letterSpacing: "1.5px"
                                },
                                style: {
                                    backgroundColor: "transparent",
                                }
                            },
                            plotOptions: {
                                series: {
                                    cursor: 'pointer',
                                    point: {
                                        events: {
                                            click: function () {
                                                $state.go('details', { name: this.name });
                                            }
                                        }
                                    }
                                }

                            },
                            title: {
                                text: '',
                                enabled: false,
                            },
                            tooltip: {
                                backgroundColor: "rgba(4,4,4,0.6)",
                                borderColor: "rgba(1, 169, 130, 0.9)",
                                animation: true,
                                style: {
                                    color: 'white',
                                    opacity: 0.8,
                                    borderColor: "red"
                                },
                            },
                            series: series
                        });
                    
            }

            function InitializeBasemapSeries(d) {
                if (s.state == "heatmap") {
                    return {
                        allAreas: true,
                        joinBy: ['hc-key'],
                        mapData: s.mapGeoJSON,
                        showInLegend: false,
                        data: d,
                        allowPointSelect: true,
                        color: "rgba(216, 219, 213,.6)",
                        states: {
                            hover: {
                                color: "rgba(1, 169, 130,0.5)"
                            },
                            normal: { animation: true },
                            select: {
                                color: 'rgba(1, 169, 130,0.8)',
                                borderColor: 'black',
                                dashStyle: 'long-dash'
                            }
                        },
                        borderColor: "rgba(4,4,4,0.2)",
                        borderWidth: 1,
                        point: {
                            events: {
                                click: function () {
                                    var key = this["hc-key"];
                                    if (key == "br" || key == "fr") {
                                        s.breadcrumb.push(s.mapKey);
                                        try { Highcharts.charts[0].showLoading("Loading.."); } catch (e) { }
                                        $.getScript("https://code.highcharts.com/mapdata/" + "countries/" + key.substr(0, 2) + '/' + key + "-all.js").done(function (script, status) {
                                            s.mapKey = 'countries/' + key.substr(0, 2) + '/' + key + "-all";
                                            s.InitializeMap();
                                        }).fail(function () { });

                                    }
                                }
                            }
                        },
                        tooltip: {
                            headerFormat: "",
                            hideDelay: 20000,
                            pointFormat: "<span>{point.name}</span>"
                        }
                    }
                } else {
                    return {
                        allAreas: true,
                        joinBy: ["hc-key", "key"],
                        mapData: s.mapGeoJSON,
                        showInLegend: false,
                        data: d,
                        allowPointSelect: true,
                        color: "rgba(216, 219, 213,.6)",
                        states: {
                            hover: {
                                color: "rgba(1, 169, 130,0.5)"
                            },
                            normal: { animation: true },
                            select: {
                                color: 'rgba(1, 169, 130,0.8)',
                                borderColor: 'black',
                                dashStyle: 'long-dash'
                            }
                        },
                        borderColor: "rgba(4,4,4,0.2)",
                        borderWidth: 1,
                        point: {
                            events: {
                                click: function () {
                                    var key = this["key"];
                                    if (key == "br" || key == "fr") {
                                        s.breadcrumb.push(s.mapKey);
                                        try { Highcharts.charts[0].showLoading("Loading.."); } catch (e) { }
                                        $.getScript("https://code.highcharts.com/mapdata/" + "countries/" + key.substr(0, 2) + '/' + key + "-all.js").done(function (script, status) {
                                            s.mapKey = 'countries/' + key.substr(0, 2) + '/' + key + "-all";
                                            console.log(s.mapKey);
                                            s.InitializeMap();
                                        }).fail(function () { });

                                    }
                                }
                            }
                        },
                        tooltip: {
                            headerFormat: "",
                            hideDelay: 20000,
                            pointFormat: "<span>{point.name}</span>"
                        }
                    }
                }
            }

            function GetDataFromOurJSON() {
                return $http({
                    url: "test.php",
                    method: 'GET'
                });
            }

            //Back One Level
            s.BackOneLevel = function () {
                try { Highcharts.charts[0].showLoading("Loading.."); } catch (e) { }
                s.breadcrumb.splice(s.breadcrumb.length - 1, 1);
                s.mapKey = s.breadcrumb[s.breadcrumb.length - 1];
                s.InitializeMap();
                try { Highcharts.charts[0].hideLoading(); } catch (e) { }
            }

            //Load States
            s.ChangeLoadState = function () {
                s.loadState = !s.loadState;
                //if(s.loadState)
                //s.Map.ShowLoading();
            }

            //Get Script for Map Type
            $.getScript("https://code.highcharts.com/mapdata/" + s.mapKey + '.js').done(function (script, status) {
                s.InitializeMap();
            });

            //Linking directive controller to caller controller
            s.backOneLevel = s.BackOneLevel;
            s.changeMapState = s.ChangeMapState;

            function LoadHeatmapData(state) {
                var heatmapseries = [];
                switch (state) {
                    case "custom/world":
                    default:
                        heatmapseries = [{ "hc-key": "fo", "value": 0 }, { "hc-key": "um", "value": 1 }, { "hc-key": "us", "value": 2 }, { "hc-key": "jp", "value": 3 }, { "hc-key": "sc", "value": 4 }, { "hc-key": "in", "value": 5 }, { "hc-key": "fr", "value": 6 }, { "hc-key": "fm", "value": 7 }, { "hc-key": "cn", "value": 8 }, { "hc-key": "sw", "value": 9 }, { "hc-key": "sh", "value": 10 }, { "hc-key": "br", "value": 11 }, { "hc-key": "ec", "value": 12 }, { "hc-key": "au", "value": 13 }, { "hc-key": "ki", "value": 14 }, { "hc-key": "ph", "value": 15 }, { "hc-key": "mx", "value": 16 }, { "hc-key": "es", "value": 17 }, { "hc-key": "bu", "value": 18 }, { "hc-key": "mv", "value": 19 }, { "hc-key": "sp", "value": 20 }, { "hc-key": "gb", "value": 21 }, { "hc-key": "gr", "value": 22 }, { "hc-key": "as", "value": 23 }, { "hc-key": "dk", "value": 24 }, { "hc-key": "gl", "value": 25 }, { "hc-key": "gu", "value": 26 }, { "hc-key": "mp", "value": 27 }, { "hc-key": "pr", "value": 28 }, { "hc-key": "vi", "value": 29 }, { "hc-key": "ca", "value": 30 }, { "hc-key": "st", "value": 31 }, { "hc-key": "cv", "value": 32 }, { "hc-key": "dm", "value": 33 }, { "hc-key": "nl", "value": 34 }, { "hc-key": "ye", "value": 35 }, { "hc-key": "jm", "value": 36 }, { "hc-key": "ws", "value": 37 }, { "hc-key": "om", "value": 38 }, { "hc-key": "vc", "value": 39 }, { "hc-key": "tr", "value": 40 }, { "hc-key": "bd", "value": 41 }, { "hc-key": "sb", "value": 42 }, { "hc-key": "lc", "value": 43 }, { "hc-key": "nr", "value": 44 }, { "hc-key": "no", "value": 45 }, { "hc-key": "kn", "value": 46 }, { "hc-key": "bh", "value": 47 }, { "hc-key": "to", "value": 48 }, { "hc-key": "fi", "value": 49 }, { "hc-key": "id", "value": 50 }, { "hc-key": "mu", "value": 51 }, { "hc-key": "se", "value": 52 }, { "hc-key": "tt", "value": 53 }, { "hc-key": "my", "value": 54 }, { "hc-key": "bs", "value": 55 }, { "hc-key": "pw", "value": 56 }, { "hc-key": "tv", "value": 57 }, { "hc-key": "mh", "value": 58 }, { "hc-key": "cl", "value": 59 }, { "hc-key": "th", "value": 60 }, { "hc-key": "gd", "value": 61 }, { "hc-key": "ee", "value": 62 }, { "hc-key": "ag", "value": 63 }, { "hc-key": "tw", "value": 64 }, { "hc-key": "bb", "value": 65 }, { "hc-key": "it", "value": 66 }, { "hc-key": "mt", "value": 67 }, { "hc-key": "pg", "value": 68 }, { "hc-key": "vu", "value": 69 }, { "hc-key": "sg", "value": 70 }, { "hc-key": "cy", "value": 71 }, { "hc-key": "km", "value": 72 }, { "hc-key": "fj", "value": 73 }, { "hc-key": "ru", "value": 74 }, { "hc-key": "va", "value": 75 }, { "hc-key": "sm", "value": 76 }, { "hc-key": "kz", "value": 77 }, { "hc-key": "az", "value": 78 }, { "hc-key": "am", "value": 79 }, { "hc-key": "tj", "value": 80 }, { "hc-key": "ls", "value": 81 }, { "hc-key": "uz", "value": 82 }, { "hc-key": "pt", "value": 83 }, { "hc-key": "ma", "value": 84 }, { "hc-key": "co", "value": 85 }, { "hc-key": "tl", "value": 86 }, { "hc-key": "tz", "value": 87 }, { "hc-key": "kh", "value": 88 }, { "hc-key": "ar", "value": 89 }, { "hc-key": "sa", "value": 90 }, { "hc-key": "pk", "value": 91 }, { "hc-key": "ae", "value": 92 }, { "hc-key": "ke", "value": 93 }, { "hc-key": "pe", "value": 94 }, { "hc-key": "do", "value": 95 }, { "hc-key": "ht", "value": 96 }, { "hc-key": "ao", "value": 97 }, { "hc-key": "mz", "value": 98 }, { "hc-key": "pa", "value": 99 }, { "hc-key": "cr", "value": 100 }, { "hc-key": "ir", "value": 101 }, { "hc-key": "sv", "value": 102 }, { "hc-key": "gw", "value": 103 }, { "hc-key": "hr", "value": 104 }, { "hc-key": "bz", "value": 105 }, { "hc-key": "za", "value": 106 }, { "hc-key": "na", "value": 107 }, { "hc-key": "cf", "value": 108 }, { "hc-key": "sd", "value": 109 }, { "hc-key": "ly", "value": 110 }, { "hc-key": "cd", "value": 111 }, { "hc-key": "kw", "value": 112 }, { "hc-key": "de", "value": 113 }, { "hc-key": "ie", "value": 114 }, { "hc-key": "kp", "value": 115 }, { "hc-key": "kr", "value": 116 }, { "hc-key": "gy", "value": 117 }, { "hc-key": "hn", "value": 118 }, { "hc-key": "mm", "value": 119 }, { "hc-key": "ga", "value": 120 }, { "hc-key": "gq", "value": 121 }, { "hc-key": "ni", "value": 122 }, { "hc-key": "ug", "value": 123 }, { "hc-key": "mw", "value": 124 }, { "hc-key": "tm", "value": 125 }, { "hc-key": "sx", "value": 126 }, { "hc-key": "zm", "value": 127 }, { "hc-key": "nc", "value": 128 }, { "hc-key": "mr", "value": 129 }, { "hc-key": "dz", "value": 130 }, { "hc-key": "lt", "value": 131 }, { "hc-key": "et", "value": 132 }, { "hc-key": "er", "value": 133 }, { "hc-key": "gh", "value": 134 }, { "hc-key": "si", "value": 135 }, { "hc-key": "gt", "value": 136 }, { "hc-key": "ba", "value": 137 }, { "hc-key": "jo", "value": 138 }, { "hc-key": "sy", "value": 139 }, { "hc-key": "mc", "value": 140 }, { "hc-key": "al", "value": 141 }, { "hc-key": "uy", "value": 142 }, { "hc-key": "cnm", "value": 143 }, { "hc-key": "mn", "value": 144 }, { "hc-key": "rw", "value": 145 }, { "hc-key": "so", "value": 146 }, { "hc-key": "bo", "value": 147 }, { "hc-key": "cm", "value": 148 }, { "hc-key": "cg", "value": 149 }, { "hc-key": "eh", "value": 150 }, { "hc-key": "rs", "value": 151 }, { "hc-key": "me", "value": 152 }, { "hc-key": "bj", "value": 153 }, { "hc-key": "ng", "value": 154 }, { "hc-key": "tg", "value": 155 }, { "hc-key": "la", "value": 156 }, { "hc-key": "af", "value": 157 }, { "hc-key": "ua", "value": 158 }, { "hc-key": "sk", "value": 159 }, { "hc-key": "jk", "value": 160 }, { "hc-key": "bg", "value": 161 }, { "hc-key": "qa", "value": 162 }, { "hc-key": "li", "value": 163 }, { "hc-key": "at", "value": 164 }, { "hc-key": "sz", "value": 165 }, { "hc-key": "hu", "value": 166 }, { "hc-key": "ro", "value": 167 }, { "hc-key": "lu", "value": 168 }, { "hc-key": "ad", "value": 169 }, { "hc-key": "ci", "value": 170 }, { "hc-key": "lr", "value": 171 }, { "hc-key": "bn", "value": 172 }, { "hc-key": "be", "value": 173 }, { "hc-key": "iq", "value": 174 }, { "hc-key": "ge", "value": 175 }, { "hc-key": "gm", "value": 176 }, { "hc-key": "ch", "value": 177 }, { "hc-key": "td", "value": 178 }, { "hc-key": "kv", "value": 179 }, { "hc-key": "lb", "value": 180 }, { "hc-key": "dj", "value": 181 }, { "hc-key": "bi", "value": 182 }, { "hc-key": "sr", "value": 183 }, { "hc-key": "il", "value": 184 }, { "hc-key": "ml", "value": 185 }, { "hc-key": "sn", "value": 186 }, { "hc-key": "gn", "value": 187 }, { "hc-key": "zw", "value": 188 }, { "hc-key": "pl", "value": 189 }, { "hc-key": "mk", "value": 190 }, { "hc-key": "py", "value": 191 }, { "hc-key": "by", "value": 192 }, { "hc-key": "lv", "value": 193 }, { "hc-key": "bf", "value": 194 }, { "hc-key": "ne", "value": 195 }, { "hc-key": "tn", "value": 196 }, { "hc-key": "bt", "value": 197 }, { "hc-key": "md", "value": 198 }, { "hc-key": "ss", "value": 199 }, { "hc-key": "bw", "value": 200 }, { "hc-key": "nz", "value": 201 }, { "hc-key": "cu", "value": 202 }, { "hc-key": "ve", "value": 203 }, { "hc-key": "vn", "value": 204 }, { "hc-key": "sl", "value": 205 }, { "hc-key": "mg", "value": 206 }, { "hc-key": "is", "value": 207 }, { "hc-key": "eg", "value": 208 }, { "hc-key": "lk", "value": 209 }, { "hc-key": "cz", "value": 210 }, { "hc-key": "kg", "value": 211 }, { "hc-key": "np", "value": 212 }, { "hc-key": "br", "value": 213 }];
                        break;
                    case "countries/fr/fr-all":
                        heatmapseries = [{ "hc-key": "fr-t", "value": 0 }, { "hc-key": "fr-h", "value": 1 }, { "hc-key": "fr-e", "value": 2 }, { "hc-key": "fr-r", "value": 3 }, { "hc-key": "fr-u", "value": 4 }, { "hc-key": "fr-n", "value": 5 }, { "hc-key": "fr-p", "value": 6 }, { "hc-key": "fr-o", "value": 7 }, { "hc-key": "fr-v", "value": 8 }, { "hc-key": "fr-s", "value": 9 }, { "hc-key": "fr-g", "value": 10 }, { "hc-key": "fr-k", "value": 11 }, { "hc-key": "fr-a", "value": 12 }, { "hc-key": "fr-c", "value": 13 }, { "hc-key": "fr-f", "value": 14 }, { "hc-key": "fr-l", "value": 15 }, { "hc-key": "fr-d", "value": 16 }, { "hc-key": "fr-b", "value": 17 }, { "hc-key": "fr-i", "value": 18 }, { "hc-key": "fr-q", "value": 19 }, { "hc-key": "fr-j", "value": 20 }, { "hc-key": "fr-m", "value": 21 }, { "hc-key": "fr-re", "value": 22 }, { "hc-key": "fr-yt", "value": 23 }, { "hc-key": "fr-gf", "value": 24 }, { "hc-key": "fr-mq", "value": 25 }, { "hc-key": "fr-gp", "value": 26 }, { "value": 27 }];
                        break;
                    case "countries/br/br-all":
                        heatmapseries = [{ "hc-key": "br-sp", "value": 0 }, { "hc-key": "br-ma", "value": 1 }, { "hc-key": "br-pa", "value": 2 }, { "hc-key": "br-sc", "value": 3 }, { "hc-key": "br-ba", "value": 4 }, { "hc-key": "br-ap", "value": 5 }, { "hc-key": "br-ms", "value": 6 }, { "hc-key": "br-mg", "value": 7 }, { "hc-key": "br-go", "value": 8 }, { "hc-key": "br-rs", "value": 9 }, { "hc-key": "br-to", "value": 10 }, { "hc-key": "br-pi", "value": 11 }, { "hc-key": "br-al", "value": 12 }, { "hc-key": "br-pb", "value": 13 }, { "hc-key": "br-ce", "value": 14 }, { "hc-key": "br-se", "value": 15 }, { "hc-key": "br-rr", "value": 16 }, { "hc-key": "br-pe", "value": 17 }, { "hc-key": "br-pr", "value": 18 }, { "hc-key": "br-es", "value": 19 }, { "hc-key": "br-rj", "value": 20 }, { "hc-key": "br-rn", "value": 21 }, { "hc-key": "br-am", "value": 22 }, { "hc-key": "br-mt", "value": 23 }, { "hc-key": "br-df", "value": 24 }, { "hc-key": "br-ac", "value": 25 }, { "hc-key": "br-ro", "value": 26 }, { "hc-key": "br-br", "value": 28 }];
                        break;
                }
                return heatmapseries;
            }
        }
    }
})

/* Highcharts */
hudDirectives.directive("genericHighchart", function (ConfigurableItems) {
    return {
        restrict: 'E',
        scope: {
        },
        link: function (s, e, a) {
            s.PainterTheme = ConfigurableItems.PainterTheme;
            $(e[0]).css("height", "100%");
            $(e[0]).css("width", "100%");

            var chart = {};
            setTimeout(function () {
                chart = new Highcharts.Chart(s.data);
            }, 0);
        }
    }
});

hudDirectives.directive("latencyChart", function (DataFactory, $timeout) {
    return {
        restrict: 'E',
        scope: {
            value: "="
        },
        replace: true,
        link: function (s, e, a) {
            s.value;

            var result = [];
            $timeout( function(){ result = s.value; console.log("result", result)}, 1000);
            /*DataFactory.GetLatency().then(
            function (response) {
                result = response.data;
                console.log(response.data);
                $('#spinner').hide();
            },
            function (response) {
                console.log("LoadSystems failed");
                console.log(response);
            });*/

            (function(H) {
                H.seriesTypes.line.prototype.requireSorting = false;
            })(Highcharts)

            var chart1 = {};
            setTimeout(function () {
                e.attr('id', 'latency-chart');
                // create the chart
                Highcharts.theme = {
   colors: [ '#D4BF7B', '#FFD700', '#00886B', '#BCC6CC', '#00A0BE']}

      Highcharts.setOptions(Highcharts.theme);

       (function(H) {
        H.seriesTypes.line.prototype.requireSorting = false;
    })(Highcharts);
                chart1 = Highcharts.chart('latency-chart', {
                    chart: {
                        alignTicks: false,
                        backgroundColor: "transparent",
                        spacingBottom: 15,
                        spacingTop: 10,
                        spacingLeft: 10,
                        spacingRight: 10
                    },
                    labels: {
                        style: {
                            fontFamily: "Arial",
                            color:'white'
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    legend: {
                        enabled: true,
                        floating: true,
                        verticalAlign: 'bottom',
                        align:'right',
                        y:40,
                        itemStyle: {
                            color: 'rgba(244,244,244,.7)',
                            fontFamily: "Metric",

                        }
                    },
                    tooltip: {
                        backgroundColor: "#1E303F",
                        borderColor: "rgba(1,169,130,0.2)",
                        style: {
                            color: "rgba(244,244,244,1)"
                        },
                        borderRadius: 10
                    },
                    navigator: {
                        handles: {
                            backgroundColor: "transparent",
                            borderColor: "gray"
                        },
                        maskFill: "rgba(1,169,130,0.2)"
                    },
                    scrollbar: {
                        enabled: false
                    },
                    title: {
                        text: '',
                        floating: true,
                        style: {
                            textTransform: "uppercase",
                            letterSpacing: "1.1px",
                            color: "rgba(244,244,244,0.8)",
                            padding: "20 0 0 0",
                            fontSize: "120%"

                        }
                    },
                    xAxis: {
                        categories: s.categories,
                        type: "datetime",
                        gridLineColor: "rgba(255, 255, 255, 0.3)",
                        labels: {
                            rotation: -45,
                            style: {
                                color: "rgba(255,255,255,0.3)"
                            }
                        },
                        crosshair: true
                    },
                    yAxis: {
                        gridLineColor: "rgba(255, 255, 255, 0.3)",
                        min: 0,
                        labels: {
                            style: {
                                color: "rgba(255,255,255,0.3)"
                            },
                        },
                        title: {
                            style: {
                                color: "rgba(255,255,255,0.3)"
                            },
                            text: 'Latency'
                        },
                        plotBands: [{
                            color: 'rgba(240,128,128,0.7)', // Color value
                            from: 2000, // Start of the plot band
                            to: 3500 // End of the plot band
                          }]
                    },
                    series: result
                });
            }, 500);


            s.$watch(
                function () { return result; },
                function (newdata, olddata) {
                    if (newdata != olddata)
                        chart1 = Highcharts.chart('latency-chart', {
                            chart: {
                                alignTicks: false,
                                backgroundColor: "transparent",
                            },
                            labels: {
                                style: {
                                    fontFamily: "Arial"
                                }
                            },
                            credits: {
                                enabled: false
                            },
                            rangeSelector: {
                                selected: 1,
                                buttonTheme: {
                                    fill: "transparent",
                                    stroke: "rgba(1,169,130,0.2)",
                                    'stroke-width': 1,
                                    style: {
                                        color: "rgba(244,244,244,0.5)"
                                    },
                                    states: {
                                        hover: {
                                            fill: "rgba(1,169,130,0.2)",
                                            stroke: "rgba(1,169,130,0.2)",
                                            'stroke-width': 1,
                                            style: {
                                                color: "white"
                                            }
                                        },
                                        select: {
                                            fill: "rgba(1,169,130,0.2)",
                                            stroke: "rgba(1,169,130,0.2)",
                                            'stroke-width': 1,
                                            style: {
                                                color: "white"
                                            }
                                        },
                                        disabled: {
                                            fill: "rgba(250,250,250,0.05",
                                            stroke: "rgba(1,169,130,0.2)",
                                            'stroke-width': 0,
                                            style: {
                                                color: "gray",
                                                cursor: "not-allowed"
                                            }
                                        }
                                    }
                                },
                                buttons: [{
                                    type: 'month',
                                    count: 1,
                                    text: '1m'
                                }, {
                                    type: 'month',
                                    count: 3,
                                    text: '3m'
                                }, {
                                    type: 'month',
                                    count: 6,
                                    text: '6m'
                                }, {
                                    type: 'ytd',
                                    text: 'YTD'
                                }, {
                                    type: 'year',
                                    count: 1,
                                    text: '1y'
                                }, {
                                    type: 'all',
                                    text: 'All'
                                }],
                                inputBoxBorderColor: "rgba(1,169,130,0.2)",
                                labelStyle: {
                                    color: "rgba(244,244,244,0.5)"
                                },
                                inputStyle: {
                                    color: "rgba(244,244,244,0.5)",
                                },
                            },
                            tooltip: {
                                backgroundColor: "#1E303F",
                                borderColor: "rgba(1,169,130,0.2)",
                                style: {
                                    color: "rgba(244,244,244,1)"
                                },
                                borderRadius: 10
                            },
                            navigator: {
                                handles: {
                                    backgroundColor: "transparent",
                                    borderColor: "gray"
                                },
                                maskFill: "rgba(1,169,130,0.2)"
                            },
                            scrollbar: {
                                enabled: false
                            },
                            title: {
                                text: s.chartTitle,
                                floating: true,
                                style: {
                                    textTransform: "uppercase",
                                    letterSpacing: "1.1px",
                                    color: "rgba(244,244,244,0.8)",
                                    padding: "20 0 0 0",
                                    fontSize: "120%"

                                }
                            },
                            xAxis: {
                                categories: s.categories,
                                type: "datetime",
                                gridLineColor: "rgba(255, 255, 255, 0.3)",
                                labels: {
                                    rotation: -45,
                                    style: {
                                        color: "rgba(255,255,255,0.3)"
                                    }
                                },
                                crosshair: true
                            },
                            yAxis: {
                                gridLineColor: "rgba(255, 255, 255, 0.3)",
                                min: 0,
                                labels: {
                                    style: {
                                        color: "rgba(255,255,255,0.3)"
                                    },
                                },
                                title: {
                                    style: {
                                        color: "rgba(255,255,255,0.3)"
                                    },
                                    text: 'Latency'
                                }
                            },
                            series: result,
                            legend: {
                                layout: 'horizontal',
                                align: 'center',
                                verticalAlign: 'bottom',
                                itemStyle: {
                                    color: 'white'
                                }
                            },

                        });
                },
                true
            );
        }
    }
});