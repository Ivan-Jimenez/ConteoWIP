
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
//var uriApi = 'http://schi-web1zem/SCUU_SSH_Inventario';

// Local Server
var uriApi = 'http://localhost:49793/'; 

var errorMessage = 'Ocurrio un error! El servidor dejo de responder, intente de nuevo.';

app.config(function ($routeProvider) {
    $routeProvider
        .when('/Count', {
            templateUrl: 'Count'
        })
        .when('/Conciliation', {
            templateUrl: 'Conciliation'
        })
        .when('/Admin', {
            templateUrl: 'Admin'
        })
        .otherwise({
            templateUrl: 'Count'
        });
});


/**********************************************************************************************
 ******************************** Count Controller ********************************************
 **********************************************************************************************/
app.controller("count-controller", ($scope, $http) => {

    var countingArea = "";
    var countingType = "";

    // Initializa add modal
    //$("#addModal").modal("show");
    $("#addModal").modal({ show: false });

    $scope.showCountForm = false;
    $scope.showSelectCountForm = true;

    $scope.cancelCounting = () => {
        $scope.showSelectCountForm = true;
        $scope.showCountForm = false;
    }

    function startCounting(area, countType) {
        contingArea = area;
        countingType = countingType;

        var newArea = area;
        if (area.split('#')[0] === "SAL ") {
            newArea = "SAL_" + area.split('#')[1];
        }
        $http.get(`${uriApi}/api/Counts/?area=${newArea}&count_type=${countType}`, {
            OrderNumber: $scope.order_number,
            Product: $scope.product,
        }).then((response) => {
            $scope.products = response.data;
        }).catch(error => {
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: error.data,
            });
            console.log(error.data);
        });

        $scope.showCountForm = true;
        $scope.showSelectCountForm = false;
        console.log($scope.countType + ", " + $scope.areaLine);
    }

    $scope.count = (order, counted, countType, area) => {
        
        cleanAddForm();
        $http.get(`${uriApi}/api/Counts/?order=${order}`).then((res) => {
            console.log("count Result Exist => ", res);
            if (res.data.length > 0) {
                //saveCount(order, $scope.counted, $scope.countType);
                $scope.orderNumber = "";
                $scope.counted = "";
                if (res.data[0].AreaLine === area) {
                    saveCount(order, counted, countType, area);
                    $http.get(`${uriApi}/api/Counts/?area=${area}&count_type=${countType}`, {
                        OrderNumber: $scope.order_number,
                        Product: $scope.product,
                    }).then((response) => {
                        $scope.products = response.data;
                    });
                } else {
                    //alert("doesnt belong to this area");
                    // TODO: This isnt working fixed 
                    disableForm(false);
                    Swal.fire({
                        title: "Don't belongs to this area",
                        text: "This asset belogs to the " + res.data[0].AreaLine + " area.",
                        type: 'warning',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Ok'
                    }).then((result) => {
                        if (result.value) {
                            $scope.showComments = true;
                            $scope.product = res.data[0].Product;
                            $scope.productName = res.data[0].ProductName;
                            $scope.alias = res.data[0].Alias;
                            $scope.area_line = res.data[0].AreaLine;
                            $scope.operationNumber = res.data[0].OperationNumber;
                            $scope.operationDescription = res.data[0].OperationDescription;
                            $scope.order_number = res.data[0].OrderNumber;
                            $scope.ord_qty = res.data[0].OrdQty;
                            $scope.counted_form = counted;
                            $scope.modalTitle = "Found";
                            $("#addModal").modal({ show: true });
                        }
                    })
                    
                }
            } else {
                Swal.fire({
                    title: order + ' Not Found',
                    text: "Do you want to add it?",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, add it!'
                }).then((result) => {
                    if (result.value) {
                        cleanAddForm();
                        $scope.order_number = order;
                        $scope.counted_form = counted;
                        $scope.modalTitle = "New";
                        $("#addModal").modal({ show: true });
                        //Swal.fire(
                        //    'Deleted!',
                        //    'Your file has been deleted.',
                        //    'success'
                        //)
                    }
                })
            }
        }).catch((error) => {
            console.log("count Exist Error => ", error);
            Swal.fire({
                type: 'error',
                title: 'Error',
                text: error.statusText,
            });
            if (error.status === 404) {
                alert("product not found");
            }
        });

    }

    $scope.addOrUpdate = () => {
        var comment = "";
        if ($scope.modalTitle === "New") comment = "New@" + $scope.areaLine + "@";
        else comment = "Found@" + $scope.counted_form + "@" + $scope.areaLine + "@";

        $http.put(`${uriApi}/api/Counts/${$scope.order_number}`, {
            Product: $scope.product,
            OrderNumber: $scope.order_number,
            Alias: $scope.alias,
            ProductName: $scope.productName,
            AreaLine: $scope.area_line,
            OperationNumber: $scope.operationNumber,
            OperationDescription: $scope.operationDescription,
            OrdQty: $scope.ord_qty,
            Comments: comment + $scope.comments,
        }).then((res) => {
            console.log("addOrUpdate Result => ", res.data);
            saveCount($scope.order_number, $scope.counted_form, $scope.countType, $scope.areaLine);
            $scope.orderNumber = "";
            $scope.counted = "";
            Swal.fire(
                "Added it!",
                "The asset was added successfully.",
                "success"
            );
        }).catch((error) => {
            console.log("addOrUpdate Error => ", error.data);
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: error.data,
            });
        });
    }

    $scope.showDiscrepancies = (area, countType) => {
        //if ($scope.showDiscrepancies === "Discrepancies") {
        //    $http.get(`${uriApi}/api/Discrepancies/?area=${area}&count_type=${countType}`).then((res) => {
        //        $scope.products = res.data;
        //    }).catch((error) => {
        //        console.log(error.status);
        //    });
        //    $scope.textDiscrepancies = "   Results   ";
        //} else {
        //    $http.get(`${uriApi}/api/Counts/?area=${area}&count_type=${countType}`, {
        //        OrderNumber: $scope.order_number,
        //        Product: $scope.product,
        //    }).then((response) => {
        //        $scope.products = response.data;
        //    });
        //}

        $http.get(`${uriApi}/api/Discrepancies/?area=${area}&count_type=${countType}`).then((res) => {
            $scope.products = res.data;
        }).catch((error) => {
            console.log(error.status);
        });
    }

    $scope.finishCounting = () => {
        $scope.showFinishOptions = true;
        $scope.showCountForm = false;
        $scope.showDownloadBtn = true;
    }

    $scope.countAgain = () => {
        $scope.showFinishOptions = false;
        $scope.showCountForm = true;
        $scope.showDownloadBtn = false;
    }

    $scope.closeArea = (area, countType) => {
        Swal.fire({
            title: 'Close Area',
            text: "Do you to close "+area+"?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Close it!'
        }).then((result) => {
            if (result.value) {
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
                $scope.showDownloadBtn = false;
            }
        })
    }

    $scope.isAreaClosed = (area, countType) => {
        if (countType === "Count") {
            $http.get(`${uriApi}/api/FirstCountStatus/?id=${area}`).then((res) => {
                console.log("isAreaClosed Result => " + res.data.Finish);
                if (!res.data.Finish) {
                    startCounting(area, countType)
                } else {
                    Swal.fire({
                        type: 'error',
                        title: 'Oops...',
                        text: 'The ' + area + " area is closed!",
                    });
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
                    Swal.fire({
                        type: 'error',
                        title: 'Oops...',
                        text: 'The ' + area + " area is closed!",
                    });
                }
            }).catch((error) => {
                console.log("isAreaClosed Error => " + error);
                if (error.status === 404) {
                    startCounting(area, countType);
                }
            });
        }
    }

    /********************************************************************************************
     ********************************* Util Fuctions ******************************************** 
     ********************************************************************************************/

    function cleanAddForm() {
        $scope.product = "";
        $scope.productName = "";
        $scope.alias = "";
        $scope.area_line = "";
        $scope.operationNumber = "";
        $scope.operationDescription= "";
        $scope.order_number = "";
        $scope.ord_qty = "";
        $scope.counted_form = "";
        $scope.comments = "";
        $scope.showComments = false;
    }

    function saveCount(order, counted, countType, area) {
        $http.put(`${uriApi}/api/Counts/?order=${order}&counted=${counted}&count_type=${countType}&area=${area}`).then((res) => {
            console.log("saveCount Result => ", res.data);
            if (res.data === "StatusOK") {
                Swal.fire(
                    "Status OK!",
                    "This asset is already counted and has an Ok Status.",
                    "warning"
                );
            } else {
                Swal.fire(
                    "Counted!",
                    "The count for " + order + " was saved successfully.",
                    "success"
                );
            }
        }).catch(error => {
            console.log(error);
            Swal.fire({
                type: 'error',
                title: 'Error...',
                text: error.statusText,
            });
        });
    }

    $scope.downloadDiscrepancies = (area, countType) => {
        window.open(`${uriApi}/api/Data/?area=${area}&count_type=${countType}`);
    }

    function disableForm(disable) {
        $scope.disableProduct = disable;
        $scope.disableProductName = disable;
        $scope.disable_area_line = disable;
        $scope.disableOperationNumber = disable;
        $scope.disableOrderNumber = disable;
        $scope.disableOrd_qty = disable;
        $scope.disableCountedForm = disable;
    }
});

/**********************************************************************************************
 ******************************** Conciliation Controller *************************************
 **********************************************************************************************/

app.controller("conciliation-controller", ($scope, $http) => {

    //showAll();

    $http.get(`${uriApi}/api/Counts/`).then((res) => {
        $scope.products = res.data;
    }).catch((error) => {
        snackbar(error.data);
    });

    $scope.showAll = () => {
        showAll();
    }

    $scope.showDiscrepancies = () => {
        $http.get(`${uriApi}/api/Discrepancies/?area=${$scope.area_line}&count_type=ReCount`).then((res) => {
            $scope.products = res.data;
        }).catch((error) => {
            snackbar(error.data);
        });
    }

    $scope.select = (order) => {
        $scope.orderConciliation = order;
    }

    $scope.saveConciliation = (order, conciliation) => {
        $http.put(`${uriApi}/api/Counts/?order=${order}&conciliation=${conciliation}`).then((res) => {
            alert("saved");
        }).catch((error) => {
            snackbar(error.data);
        });
    }

    /*************************************************************************************
     *************************** Util Functions ******************************************
     *************************************************************************************/

    function showAll() {
        $http.get(`${uriApi}/api/Counts/?area=${$scope.area_line}&count_type=Count`).then((res) => {
            $scope.products = res.data;
        }).catch((error) => {
            snackbar(error.data);
        });
    }
});

/**********************************************************************************************
 ********************************* Admin Controller *******************************************
 **********************************************************************************************/
app.controller("admin-controller", ($scope, $http) => {

});