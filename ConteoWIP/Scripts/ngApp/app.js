
closeOverlay = () => {
    document.getElementById("myNav").style.width = "0%";
}

endOverlay = () => {
    document.getElementById("myx").classList.remove('hide');
    document.getElementById("mydetalle").classList.add('hide');
}


snackbar = (message) => {
    var notify = document.querySelector('#snackbar');
    notify.innerText = message;
    notify.className = 'show';

    setTimeout(function () {
        notify.className = notify.className.replace('show', '');
    }, 3000);
};


var app = angular.module('template-app', ['ngRoute']);

// Production Server
//var uriApi = 'http://schi-iis1zem/ZCUU_ZEM_Activos';

// Testing Server 
//var uriApi = 'http://schi-web1zem/ZCUU_ZEM_Activos';

// Local Server
var uriApi = 'http://localhost:49793/'; 

var errorMessage = 'Ocurrio un error! El servidor dejo de responder, intente de nuevo.';

app.config(function ($routeProvider) {
    $routeProvider
        .when('/Count', {
            templateUrl: 'Count'
        })
        .otherwise({
            templateUrl: 'Count'
        });
});

app.controller("count-controller", ($scope, $http) => {
    console.log("count controller")

    $scope.showCountForm = false;
    $scope.showSelectCountForm = true;

    $scope.cancelCounting = () => {
        $scope.showSelectCountForm = true;
        $scope.showCountForm = false;
    }

    function startCounting(area, countType) {
        $http.get(`${uriApi}/api/Counts/?area=${area}&count_type=${countType}`).then((response) => {
            $scope.products = response.data;
        }).catch(error => {
            console.log(error.data);
        });

        $scope.showCountForm = true;
        $scope.showSelectCountForm = false;
        console.log($scope.countType + ", " + $scope.areaLine);
    }

    $scope.count = (order, counted, countType, area) => {
        $http.get(`${uriApi}/api/Counts/?order=${order}`).then((res) => {
            console.log("count Result Exist => ", res);
            if (res.data.length > 0) {
                if (res.data[0].AreaLine === area) {
                    alert("belongs to this area ");
                    saveCount(order, counted, countType);
                } else {
                    alert("doesnt belong to this area")
                }
            } else {
                alert("not funking found")
            }
        }).catch((error) => {
            console.log("count Exist Error => ", error);
            if (error.status === 404) {
                alert("product not found");
            }
        });

    }

    function saveCount(order, counted, countType) {
        $http.put(`${uriApi}/api/Counts/?order=${order}&counted=${counted}&count_type=${countType}`).then((res) => {
            console.log("saveCount Result => ", res.data);
        }).catch(error => {
            console.log(error);
        });
    }

    $scope.finishCounting = (area, countType) => {
        $http.get(`${uriApi}/api/Discrepancies/?area=${area}&count_type=${countType}`).then((res) => {
            $scope.products = res.data
            $scope.showFinishOptions = true;
            $scope.showCountForm = false;
        }).catch((error) => {
            console.log(error.status);
        });
    }

    $scope.countAgain = () => {
        $scope.showFinishOptions = false;
        $scope.showCountForm = true;
    }

    $scope.closeArea = (area, countType) => {
        if (countType === "Count") {
            $http.put(`${uriApi}/api/FirstCountStatus/?id=${area}&`, { AreaLine: area, Finish: true }).then((res) => {
                console.log("closeArea Result => " + res.data);
                $scope.showSelectCountForm = true;
                $scope.showFinishOptions = false;
            }).catch((error) => {
                console.log("closeArea Error => ", error);
            });
        } else {
            $http.put(`${uriApi}/api/ReCountStatus/?id=${area}&`, { AreaLine: area, Finish: true }).then((res) => {
                console.log("closeArea Result => " + res.data);
            }).catch((error) => {
                console.log("closeArea Error => ", error);
            });
        }
    }

    $scope.isAreaClosed = (area, countType) => {
        if (countType === "Count") {
            $http.get(`${uriApi}/api/FirstCountStatus/?id=${area}`).then((res) => {
                console.log("isAreaClosed Result => " + res.data.Finish);
                if (!res.data.Finish) {
                    startCounting(area, countType)
                } else {
                    alert("area is closed");
                }
            }).catch((error) => {
                console.log("isAreaClosed Error => " + error);
                if (error.status === 404) {
                    startCounting(area, countType);
                }
            });
        } else {
            $http.get(`${uriApi}/api/ReCountStatus/?id=${area}`).then((res) => {
                console.log("isAreaClosed Result => " + res);
                if (!res.data.Finish) {
                    startCounting(area, countType)
                } else {
                    alert("are is closed")
                }
            }).catch((error) => {
                console.log("isAreaClosed Error => " + error);
                if (error.status === 404) {
                    startCounting(area, countType);
                }
            });
        }
    }
});
