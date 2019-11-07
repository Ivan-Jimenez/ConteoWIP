
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
        .when('/CountWIP', {
            templateUrl: 'CountWIP'
        })
        .when('/CountBINS', {
            templateUrl: 'CountBINS'
        })
        .when('/ConciliationWIP', {
            templateUrl: 'ConciliationWIP'
        })
        .when('/ConciliationBINS', {
            templateUrl: 'conciliationBINS'
        })
        .when('/AdminUsers', {
            templateUrl: 'AdminUsers'
        })
        .when('/AdminAreas', {
            templateUrl: 'AdminAreas'
        })
        .otherwise({
            templateUrl: 'CountWIP'
        });
});


/**********************************************************************************************
 *******************************+ Count WIP Controller +**************************************
 **********************************************************************************************/
app.controller("count-WIP-controller", ($scope, $http) => {

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

        var newArea = area;
        if (area.split('#')[0] === "SAL ") {
            newArea = "SAL_" + area.split('#')[1];
        }

        cleanAddForm();
        $http.get(`${uriApi}/api/Counts/?order=${order}`).then((res) => {
            console.log("count Result Exist => ", res);
            if (res.data.length > 0) {
                //saveCount(order, $scope.counted, $scope.countType);
                $scope.orderNumber = "";
                $scope.counted = "";
                if (res.data[0].AreaLine === area) {
                    saveCount(order, counted, countType, newArea);
                    $http.get(`${uriApi}/api/Counts/?area=${newArea}&count_type=${countType}`, {
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

        var newArea = area;
        if (area.split('#')[0] === "SAL ") {
            newArea = "SAL_" + area.split('#')[1];
        }

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
                    $http.put(`${uriApi}/api/FirstCountStatus/?id=${newArea}&`, { AreaLine: area, Finish: true }).then((res) => {
                        console.log("closeArea Result => " + res.data);
                        $scope.showSelectCountForm = true;
                        $scope.showFinishOptions = false;
                    }).catch((error) => {
                        console.log("closeArea Error => ", error);
                    });
                } else {
                    $http.put(`${uriApi}/api/ReCountStatus/?id=${newArea}&`, { AreaLine: area, Finish: true }).then((res) => {
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
 ******************************+ Count BINS Controller +***************************************
 **********************************************************************************************/
app.controller("count-BINS-controller", ($scope, $http) => {
    var countingType = "";
    var countingArea = "";

    $("#addModal").modal({ show: false });

    $scope.showCountForm = false;
    $scope.showSelectCountForm = true;

    $scope.cancelCounting = () => {
        $scope.showSelectCountForm = true;
        $scope.showCountForm = false;
    }

    $scope.finishCounting = () => {
        $scope.showFinishOptions = true;
        $scope.showCountForm = false;
        $scope.showDownloadBtn = true;
    }

    $scope.count = (order, counted, countType, area) => {

        var newArea = area;
        // if (area.split('#')[0] === "SAL ") {
        //     newArea = "SAL_" + area.split('#')[1];
        // }

        cleanAddForm();
        $http.get(`${uriApi}/api/CountBINS/?order=${order}&area=${area}&something=FuckYou`).then((res) => {
            console.log("count Result Exist => ", res);
            if (res.data.length > 0) {
                //saveCount(order, $scope.counted, $scope.countType);
                $scope.orderNumber = "";
                $scope.counted = "";
                if (res.data[0].AreaLine === area) {
                    saveCount(order, counted, countType, newArea);
                    $http.get(`${uriApi}/api/CountBINS/?area=${newArea}&count_type=${countType}`, {
                        OrderNumber: $scope.order_number,
                        Product: $scope.product,
                    }).then((response) => {
                        $scope.products = response.data;
                    });
                } //else {
                //     //alert("doesnt belong to this area");
                //     // TODO: This isnt working fixed 
                //     disableForm(false);
                //     Swal.fire({
                //         title: "Don't belongs to this area",
                //         text: "This asset belogs to the " + res.data[0].AreaLine + " area.",
                //         type: 'warning',
                //         showCancelButton: false,
                //         confirmButtonColor: '#3085d6',
                //         cancelButtonColor: '#d33',
                //         confirmButtonText: 'Ok'
                //     }).then((result) => {
                //         if (result.value) {
                //             $scope.showComments = true;
                //             $scope.product = res.data[0].Product;
                //             $scope.productName = res.data[0].ProductName;
                //             $scope.alias = res.data[0].Alias;
                //             $scope.area_line = res.data[0].AreaLine;
                //             $scope.operationNumber = res.data[0].OperationNumber;
                //             $scope.operationDescription = res.data[0].OperationDescription;
                //             $scope.order_number = res.data[0].OrderNumber;
                //             $scope.ord_qty = res.data[0].OrdQty;
                //             $scope.counted_form = counted;
                //             $scope.modalTitle = "Found";
                //             $("#addModal").modal({ show: true });
                //         }
                //     })

                // }
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

    $scope.countAgain = () => {
        $scope.showFinishOptions = false;
        $scope.showCountForm = true;
        $scope.showDownloadBtn = false;
    }

    $scope.closeArea = (area, countType) => {

        var newArea = area;
        // if (area.split('#')[0] === "SAL ") {
        //     newArea = "SAL_" + area.split('#')[1];
        // }

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
                    $http.put(`${uriApi}/api/FirstCountStatusBINS/?id=${newArea}&`, { AreaLine: area, Finish: true }).then((res) => {
                        console.log("closeArea Result => " + res.data);
                        $scope.showSelectCountForm = true;
                        $scope.showFinishOptions = false;
                    }).catch((error) => {
                        console.log("closeArea Error => ", error);
                    });
                } else {
                    $http.put(`${uriApi}/api/ReCountStatusBINS/?id=${newArea}&`, { AreaLine: area, Finish: true }).then((res) => {
                        console.log("closeArea Result => " + res.data);
                    }).catch((error) => {
                        console.log("closeArea Error => ", error);
                    });
                }
                $scope.showDownloadBtn = false;
            }
        })
    }

    $scope.showDiscrepancies = (area, countType) => {
        $http.get(`${uriApi}/api/DiscrepanciesBINS/?area=${area}&count_type=${countType}`).then((res) => {
            $scope.products = res.data;
        }).catch((error) => {
            console.log(error.status);
        });
    }

    $scope.addOrUpdate = () => {
        var comment = "";
        if ($scope.modalTitle === "New") comment = "New@" + $scope.areaLine + "@";
        else comment = "Found@" + $scope.counted_form + "@" + $scope.areaLine + "@";

        $http.put(`${uriApi}/api/CountBINS/${$scope.order_number}`, {
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

    $scope.isAreaClosed = (area, countType) => {
        if (countType === "Count") {
            $http.get(`${uriApi}/api/FirstCountStatusBINS/?id=${area}`).then((res) => {
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
            $http.get(`${uriApi}/api/ReCountStatusBins/?id=${area}`).then((res) => {
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

    /********************************************************************************
     **************************** Util Fuctions *************************************
     ********************************************************************************/
    function startCounting(area, countType) {
        //contingArea = area;
        //countingType = countType;

        var newArea = area;
        //if (area.split('#')[0] === "SAL ") {
        //    newArea = "SAL_" + area.split('#')[1];
        //}
        $http.get(`${uriApi}/api/CountBINS/?area=${newArea}&count_type=${countType}`, {
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

    function saveCount(order, counted, countType, area) {
        $http.put(`${uriApi}/api/CountBINS/?order=${order}&counted=${counted}&count_type=${countType}&area=${area}`).then((res) => {
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
        window.open(`${uriApi}/api/DataBINS/?area=${area}&count_type=${countType}`);
    }

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
});


/**********************************************************************************************
 ***************************+ Conciliation WIP Controller +************************************
 **********************************************************************************************/
app.controller("conciliation-WIP-controller", ($scope, $http) => {

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
        if ($scope.area_line === undefined || $scope.areaLine === '') {
            $http.get(`${uriApi}/api/Discrepancies/`).then((res) => {
                $scope.products = res.data;
            }).catch((error) => {
                snackbar(error.data);
            });
        } else {
            $http.get(`${uriApi}/api/Discrepancies/?area=${$scope.area_line}&count_type=ReCount`).then((res) => {
                $scope.products = res.data;
            }).catch((error) => {
                snackbar(error.data);
            });
        }
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

    $scope.downloadAllDiscrepancies = () => {
        window.open(`${uriApi}/api/Data/?area=all&count_type=All`);
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
 *****************************+ Conciliation BINS Controller +********************************
 **********************************************************************************************/
app.controller("conciliation-BINS-controller", ($scope, $http) => {
    $http.get(`${uriApi}/api/CountBINS/`).then((res) => {
        $scope.products = res.data;
    }).catch((error) => {
        snackbar(error.data);
    });

    $scope.showAll = () => {
        showAll();
    }

    $scope.showDiscrepancies = () => {
        if ($scope.area_line === undefined || $scope.areaLine === '') {
            $http.get(`${uriApi}/api/DiscrepanciesBINS/`).then((res) => {
                $scope.products = res.data;
            }).catch((error) => {
                snackbar(error.data);
            });
        } else {
            $http.get(`${uriApi}/api/DiscrepanciesBINS/?area=${$scope.area_line}&count_type=ReCount`).then((res) => {
                $scope.products = res.data;
            }).catch((error) => {
                snackbar(error.data);
            });
        }
    }

    $scope.select = (order, area) => {
        $scope.orderConciliation = order;
        $scope.areaConciliation = area;
    }

    $scope.saveConciliation = (order, area, conciliation) => {
        $http.put(`${uriApi}/api/CountBINS/?order=${order}&area=${area}&conciliation=${conciliation}`).then((res) => {
            alert("saved");
        }).catch((error) => {
            snackbar(error.data);
        });
    }

    $scope.downloadAllDiscrepancies = () => {
        window.open(`${uriApi}/api/DataBINS/?area=all&count_type=All`);
    }

    /*************************************************************************************
     *************************** Util Functions ******************************************
     *************************************************************************************/

    function showAll() {
        $http.get(`${uriApi}/api/CountBINS/?area=${$scope.area_line}&count_type=Count`).then((res) => {
            $scope.products = res.data;
        }).catch((error) => {
            snackbar(error.data);
        });
    }
});


/*********************************************************************************************
 *****************************+ Admin Areas Controller +*************************************
 *****************************************************+++++++++++++++*************************/
app.controller("adminAreas-Controller", ($scope, $http) => {
    // Gets all WIP areas status
    $http.get(`${uriApi}/api/FirstCountStatus/`).then((res) => {
        console.log(res.data);
        $scope.wipFirst = res.data;
    }).catch((error) => {
        snackbar(error.data);
    });

    // Gets all BINS areas status
    $http.get(`${uriApi}/api/FirstCountStatusBINS/`).then((res) => {
        console.log(res.data);
        $scope.binsFirst = res.data;
    }).catch((error) => {
        snackbar(error.data);
    });

    // WIP
    $http.get(`${uriApi}/api/ReCountStatus/`).then((res) => {
        console.log(res.data);
        $scope.wipRecount = res.data;
    }).catch((error) => {
        snackbar(error.data);
    });

    // BINS
    $http.get(`${uriApi}/api/ReCountStatusBINS/`).then((res) => {
        console.log(res.data);
        $scope.binsRecount = res.data;
    }).catch((error) => {
        snackbar(error.data);
    });

    // WIP
    $scope.openWipFirst = (area) => {
        var newArea = area;
        if (area.split('#')[0] === 'SAL ') {
            newArea = 'SAL_' + area.split('#')[1];
        }

        $http.put(`${uriApi}/api/FirstCountStatus/${newArea}`, { AreaLine: area, Finish: false }).then((res) => {
            snackbar(res.data);
        }).catch((error) => {
            snackbar(error.data);
        });
    }

    // BINS
    $scope.openBinsFirst = (area) => {
        var newArea = area;
        // if (area.split('#')[0] === 'SAL ') {
        //     newArea = 'SAL_' + area.split('#')[1];
        // }

        $http.put(`${uriApi}/api/FirstCountStatusBINS/${newArea}`, { AreaLine: area, Finish: false }).then((res) => {
            snackbar(res.data);
        }).catch((error) => {
            snackbar(error.data);
        });
    }

    // WIP
    $scope.openWipRecount = (area) => {
        var newArea = area;
        if (area.split('#')[0] === 'SAL ') {
            newArea = 'SAL_' + area.split('#')[1];
        }

        $http.put(`${uriApi}/api/ReCountStatus/${newArea}`, { AreaLine: area, Finish: false }).then((res) => {
            snackbar(res.data);
        }).catch((error) => {
            snackbar(error.data);
        });
    }

    //BINS
    $scope.openBinsRecount = (area) => {
        var newArea = area;
        // if (area.split('#')[0] === 'SAL ') {
        //     newArea = 'SAL_' + area.split('#')[1];
        // }

        $http.put(`${uriApi}/api/ReCountStatusBINS/${newArea}`, { AreaLine: area, Finish: false }).then((res) => {
            snackbar(res.data);
        }).catch((error) => {
            snackbar(error.data);
        });
    }
});

/**********************************************************************************************
 ********************************+ Admin Users Controller +************************************
 **********************************************************************************************/
var id_sistema = 1;
app.controller("adminUsers-controller", ($scope, $http) => {
    $scope.accion = "Crear Usuario";
    $scope.nuevo = true;
    $scope.id_usuario = 0;
    $scope.usuario = "";

    $http.get(`${uriApi}/api/FiltrosUsuarios/getValor?tipo=3&id1=${id_sistema}`).then((response) => {

        $scope.usuarios = response.data;
    });

    $http.get(`${uriApi}/api/FiltrosUsuarios/getValor?tipo=6&id1=${id_sistema}`).then((response) => {

        $scope.usuariosdivisiones = response.data;
    });

    $http.get(`${uriApi}/api/FiltrosUsuarios/getValor?tipo=1&id1=${id_sistema}`).then(function (response) {
        $scope.rolesporsistema = response.data;
        var index = $scope.rolesporsistema.find(x => x.Descripcion == "Operativo Sistemas");
        $scope.rolusuario = index;
    });

    $http.get(`${uriApi}/api/Divisiones`).then(function (response) {
        $scope.divisiones = response.data;
    });

    $scope.empleadoDivisiones = [];
    $scope.Editar = function (id_usuario) {
        $scope.accion = "Editar Usuario";
        $scope.LimpiarUsuario();
        $http.get(`${uriApi}/api/Usuarios/${id_usuario}`).then(function (response) {
            $scope.id_usuario = response.data.Id;
            $scope.usuario = response.data.Usuario;
            $scope.correo = response.data.Email;

            $http.get(`${uriApi}/api/FiltrosUsuarios/getValor?tipo=2&id1=${id_sistema}&id2=${id_usuario}`).then(function (response) {
                var Id_rol = "";
                if (response.data.length > 0) {
                    Id_rol = "" + response.data[0].Id_Rol;
                }
                //$scope.myVar = Id_rol;
                var index = $scope.rolesporsistema.find(x => x.Id == Id_rol);
                $scope.rolusuario = index;

                $http.get(`${uriApi}/api/FiltrosUsuarios/getValor?tipo=5&id1=${id_sistema}&strValor=${$scope.usuario}`).then(function (response) {
                    usuarioDivisiones = response.data;
                    $scope.empleadoDivisiones = response.data;
                });

            });
        });
    }

    $scope.chageValue = function (Id_rol) {
        $scope.myVar = Id_rol;
    };

    $scope.BuscarUsuario = function () {

        var usuario = $scope.usuario;
        $scope.LimpiarUsuario();
        $scope.usuario = usuario;
        $http.get(`${uriApi}/api/FiltrosUsuarios/getValor?tipo=4&strValor=${$scope.usuario}`).then(function (response) {
            var Id_rol = "";
            if (response.data.length === 0) {
                $http.get(`${uriApi}/api/FiltrosUsuarios/getInfo?strValor=${$scope.usuario}`).then(function (response) {
                    if (response.data.usuario === "") {
                        snackbar("Usuario no encontrado");
                        $scope.usuario = "";
                        $scope.correo = "";
                    } else {
                        $scope.usuario = response.data.usuario;
                        $scope.correo = response.data.correo;
                    }
                }).catch(function (response) {
                    snackbar(strMensajeError);
                });
            }
            else {
                $scope.id_usuario = response.data[0].Id;
                $scope.usuario = response.data[0].Usuario;
                $scope.correo = response.data[0].Email;
            }
        });


    }

    $scope.LimpiarUsuario = function () {
        $scope.id_usuario = 0;
        $scope.usuario = "";
        $scope.correo = "";
        $scope.myVar = "";
        $scope.empleadoDivisiones = [];
        $scope.rolusuario = [];
        usuarioDivisiones = [];
        $http.get(`${uriApi}/api/Divisiones`).then(function (response) {
            $scope.divisiones = response.data;
        });
        $http.get(`${uriApi}/api/FiltrosUsuarios/getValor?tipo=1&id1=${id_sistema}`).then(function (response) {
            $scope.rolesporsistema = response.data;
            var index = $scope.rolesporsistema.find(x => x.Descripcion == "Operativo Sistemas");
            $scope.rolusuario = index;
        });
    }

    $scope.delete = function (id_usuario) {

        $http.get(`${uriApi}/api/Usuarios/${id_usuario}`).then(function (response) {
            var usuario = response.data.Usuario;
            var id_usuario = response.data.Id;
            Swal.fire({
                title: `Deseas dar de baja el usuario ${response.data.Usuario}?`,
                //text: "Baja Usuario",
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Aceptar'
            }).then((result) => {
                if (result.value) {
                    $http.delete(`${uriApi}/api/FiltrosUsuarios/delete?tipo=1&id1=${id_sistema}&strValor=${usuario}`).then(function (response) {
                        $http.get(`${uriApi}/api/FiltrosUsuarios/getValor?tipo=2&id1=${id_sistema}&id2=${id_usuario}`).then(function (response) {
                            var id_usuario_rol = response.data[0].Id;
                            $http.delete(`${uriApi}/api/UsuarioRoles/${id_usuario_rol}`).then(function (data) {
                                $scope.LimpiarUsuario();
                                Swal.fire(
                                    'Eliminado',
                                    `Usuario Eliminado`,
                                    'success'
                                )
                                $http.get(`${uriApi}/api/FiltrosUsuarios/getValor?tipo=3&id1=${id_sistema}`).then((response) => {
                                    $scope.usuarios = response.data;
                                });
                                $http.get(`${uriApi}/api/FiltrosUsuarios/getValor?tipo=6&id1=${id_sistema}`).then((response) => {
                                    $scope.usuariosdivisiones = response.data;
                                });
                            }).error(function (data) {
                                snackbar(strMensajeError);
                            });
                        });
                    });
                }
            })
        });
    }

    $scope.addorupdateUser = function () {
        if ($scope.mainForMasterUsuario.$valid) {
            var Usuario = {
                Id: $scope.id_usuario,
                Usuario: $scope.usuario,
                Email: $scope.correo
            };

            //Guardar y/o actualizar usuario
            $http.post(`${uriApi}/api/Usuarios`, Usuario).then(function (response) {
                $scope.id_usuario = response.data.Id;
                $http.get(`${uriApi}/api/FiltrosUsuarios/getValor?tipo=2&id1=${id_sistema}&id2=${$scope.id_usuario}`).then(function (response) {
                    var Id = 0;
                    if (response.data.length > 0) {
                        Id = response.data[0].Id;
                    }
                    var usuariorol = {
                        Id: Id,
                        Id_Usuario: $scope.id_usuario,
                        Id_rol: $scope.rolusuario.Id,
                    };
                    $http.post(`${uriApi}/api/UsuarioRoles`, usuariorol).then(function (data) {
                        $scope.guardardivisiones(0);
                    }).error(function (data) {
                        snackbar(strMensajeError);
                    });
                });
                debugger;
                $http.get(`${uriApi}/api/FiltrosUsuarios/getValor?tipo=3&id1=${id_sistema}`).then((response) => {
                    $scope.usuarios = response.data;
                });
                $http.get(`${uriApi}/api/FiltrosUsuarios/getValor?tipo=6&id1=${id_sistema}`).then((response) => {
                    $scope.usuariosdivisiones = response.data;
                });
            }).error(function (data) {
                snackbar(strMensajeError);
            });
        }
    }

    $scope.guardardivisiones = function (index) {
        if (index < usuarioDivisiones.length) {
            if (usuarioDivisiones[index].Valor) {
                var usuariorol = {
                    Id: usuarioDivisiones[index].Id,
                    Id_Usuario: $scope.id_usuario,
                    Id_Division: usuarioDivisiones[index].Id_Division,
                    Id_Sistema: id_sistema,
                };

                $http.post(`${uriApi}/api/UsuarioDivisiones`, usuariorol).then(function (data) {
                    index++;

                    $scope.guardardivisiones(index);

                }).error(function (data) {
                    snackbar(strMensajeError);
                });


            }
            else {


                $http.delete(`${uriApi}/api/UsuarioDivisiones/${usuarioDivisiones[index].Id}`, usuariorol).then(function (data) {
                    index++;

                    $scope.guardardivisiones(index);

                }).error(function (data) {
                    snackbar(strMensajeError);
                });

            }

        }
        else {
            $scope.LimpiarUsuario();
            snackbar(strMensaje);
            $http.get(`${uriApi}/api/FiltrosUsuarios/getValor?tipo=3&id1=${id_sistema}`).then((response) => {
                $scope.usuarios = response.data;
            });

            debugger;
            $http.get(`${uriApi}/api/FiltrosUsuarios/getValor?tipo=3&id1=${id_sistema}`).then((response) => {
                $scope.usuarios = response.data;
            });

            $http.get(`${uriApi}/api/FiltrosUsuarios/getValor?tipo=6&id1=${id_sistema}`).then((response) => {
                $scope.usuariosdivisiones = response.data;
            });
        }
    }
});

var usuarioDivisiones = [];
function addordeletedivision(checkbox) {
    var blnValue = checkbox.checked;
    var Id_Division = checkbox.id.replace("chk-", "");
    var index = usuarioDivisiones.find(x => x.Id_Division == Id_Division);
    if (index === undefined) {

        usuarioDivisiones.push({ Id: 0, Id_Division: Id_Division, Valor: true, Existe: 0 });
    }
    else {

        if (index.Existe === 0) {
            var index = usuarioDivisiones.findIndex(x => x.Id_Division == Id_Division);
            usuarioDivisiones.splice(index, 1);
        }
        else {
            index.Valor = blnValue;
        }
    }
}
