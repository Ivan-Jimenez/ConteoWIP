
closeOverlay = () => {
    document.getElementById("myNav").style.width = "0%";
}

endOverlay = () => {
    document.getElementById("myx").classList.remove('hide');
    document.getElementById("mydetalle").classList.add('hide');
}


// Mensaje que aparece abajo cuando se guarda, edita, ocurre un error

snackbar = (message) => {
    var notify = document.querySelector('#snackbar');
    notify.innerText = message;
    notify.className = 'show';

    setTimeout(function () {
        notify.className = notify.className.replace('show', '');
    }, 3000);
};


var app = angular.module('template-app', ['ngRoute']);

// Cuando se va a subir el proyecto descomentar esta linea y adaptarlo
// al nombre de su proyecto en el servidor

// Production Server
//var uriApi = 'http://schi-iis1zem/ZCUU_ZEM_Activos';

// Testing Server 
//var uriApi = 'http://schi-web1zem/ZCUU_ZEM_Activos';

// Mientras trabaje de forma local utilice la siguiente linea y al momento
// de subir su proyecto comentela dejando solo la de arriba sin comentar
// No olvide cambiar el puerto de su localhost

var uriApi = 'http://localhost:49793/'; 

var errorMessage = 'Ocurrio un error! El servidor dejo de responder, intente de nuevo.';

app.config(function ($routeProvider) {
    $routeProvider
        .when('/Count', {
            templateUrl: 'Count'
        })
        .when('/Foreign', {
            templateUrl: 'Foreign'
        })
        .when('/Users', {
            templateUrl: 'Users'
        })
        .otherwise({
            templateUrl: 'Count'
        });
});

app.controller("count-controller", ($scope, $http) => {
    console.log("count controller")
});
