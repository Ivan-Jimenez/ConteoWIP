var app = angular.module('myApp', ['ngRoute']);
var uriApi = 'http://localhost:60429';
var id_sistema_pantalla = 3;

//var uriApi = 'http://schi-iis1zem/ZCUU_ZEM_Inventario';
//var id_sistema_pantalla = 3;


snackbar = (message) => {
    var notify = document.querySelector('#snackbar');
    notify.innerText = message;
    notify.className = 'show';

    setTimeout(function () {
        notify.className = notify.className.replace('show', '');
    }, 3000);
};
var strMensajeError = 'Ocurrio un error en la aplicacion';
var strMensaje = 'Datos Guardados Correctamente';


//llamar();
function llamar() {
    imprimdocumento();
}
function imprimdocumento() {
    window.location = '/Reportes/ExportCreditoInfonavit?id_empleado=3346';
    var x = 0;
}
mostrarspinner = (message) => {
    document.getElementById("myspinner").classList.remove('hide');
    document.getElementById("mytexto").classList.remove('hide');
    document.getElementById("lbltexto").innerHTML = message + "...";
    document.getElementById("fondo").classList.add('back-spinner');
};

ocultarspinner = () => {
    document.getElementById("myspinner").classList.add('hide');
    document.getElementById("mytexto").classList.add('hide');
    document.getElementById("fondo").classList.remove('back-spinner');
    document.getElementById("lbltexto").innerHTML = "";
};



app.config(function ($routeProvider) {
    $routeProvider
        .when('/SolicitudBajaSistemas', {
            templateUrl: 'SolicitudBajaSistemas'
        })

        .when('/UsuariosSistemas', {
            templateUrl: 'UsuariosSistemas'
        })

        .when('/ConsultaSistemas', {
            templateUrl: 'ConsultaEmpEquipo'
        })


        .when('/AsignarHijo/:id', {
            templateUrl: function (params) {
                return 'AsignarHijo?id=' + params.id;
            }
        })

        //inventario
        .when('/Marcas', {
            templateUrl: 'Marcas'
        })
        .when('/Modelos', {
            templateUrl: 'Modelos'
        })
        .when('/Sistemas', {
            templateUrl: 'Sistemas'
        })
        .when('/Articulos', {
            templateUrl: 'Articulos'
        })

        .when('/TipoArticulos', {
            templateUrl: 'TipoArticulos'
        })

        .when('/BajaArticulos', {
            templateUrl: 'BajaArticulos'
        })
        .when('/AsignarEquipo', {
            templateUrl: 'AsignarEquipo'
        })



        .otherwise(
            {
                templateUrl: 'Inicio'
            })
});







app.controller("SolicitudBajaSistemas-Controller", function ($scope, $http, $routeParams) {

    $scope.blnVisible = false;
    $scope.GetSolicitudBajasInventario = function () {
        mostrarspinner("Cargando");
        $http.get(`${uriApi}/api/Filtros/getValor?tipo=15&id=${id_sistema_pantalla}`).then((response) => {
            $scope.solicitudInventario = response.data;
            ocultarspinner();
        });
    }

    $scope.GetSolicitudBajas = function () {
        $http.get(`${uriApi}/api/SolicitudBajas`).then((response) => {
            $scope.solicitudBaja = response.data;
        }).catch((error) => {
            snackbar(strMensajeError);
        });
    }


    $scope.GetEmpleadoArticulos = function () {
        $http.get(`${uriApi}/api/EmpleadoArticulos`).then((response) => {
            $scope.empleadosarticulos = response.data;
        }).catch((error) => {
            snackbar(strMensajeError);
        });
    }

    $scope.GetArticulos = function () {
        $http.get(`${uriApi}/api/Articulos`).then((response) => {
            $scope.articulos = response.data;
        }).catch((error) => {
            snackbar(strMensajeError);
        });
    }
    $scope.GetMarcas = function () {
        $http.get(`${uriApi}/api/Marcas`).then((response) => {
            $scope.marcas = response.data;
        }).catch((error) => {
            snackbar(strMensajeError);
        });
    }
    $scope.GetTipo = function () {
        $http.get(`${uriApi}/api/TipoArticulos`).then((response) => {
            $scope.tipo = response.data;
        }).catch((error) => {
            snackbar(strMensajeError);
        });
    }



    $scope.GetArticulosByEmpleado = function (id) {
        mostrarspinner("Buscando");
        var id_solicitud = $scope.solicitudInventario.find(x => x.id == id).id_solicitud;
        var id_empleado = $scope.solicitudBaja.find(x => x.id == id_solicitud).numero_empleado;
        //$http.get(`${uriApi}/api/Filtros/GetEmpleadoArticulos?id_empleado=${id_empleado}`).then(function (response) {
        $http.get(`${uriApi}/api/Filtros/getValor?tipo=1&id=${id_empleado}`).then(function (response) {
            $scope.empleadoarticulos = response.data;
            $scope.blnVisible = true;
            $scope.id = id;
            $scope.GetSolicitudInventarioBajasById(id);
            $scope.GetTipo();
            $scope.GetMarcas();
            $scope.GetArticulos();


            ocultarspinner();
        }).catch(function (response) {
            snackbar(strMensajeError);
        });
    }

    $scope.GetSolicitudBajasBydId = function (id) {
        $http.get(`${uriApi}/api/SolicitudBajas/${id}`).then((response) => {
            $scope.numeroEmpleado = response.data.numero_empleado;
            $scope.nombre = response.data.nombre_empleado;
        }).catch((error) => {
            snackbar(strMensajeError);
        });
    }
    $scope.GetSolicitudInventarioBajasById = function (id) {
        $http.get(`${uriApi}/api/SolicitudInventarioBajas/${id}`).then((response) => {
            $scope.GetSolicitudBajasBydId(response.data.id_solicitud);
        }).catch((error) => {
            snackbar(strMensajeError);
        });
    }

    $scope.Cancelar = function () {
        $scope.blnVisible = false;
        $scope.id = "";
        $scope.listCheckbox = [];
    }

    $scope.GetSolicitudBajasInventario();
    $scope.GetSolicitudBajas();
    $scope.GetEmpleadoArticulos();

    $scope.listCheckbox = [];
    $scope.addToList = function (id, item) {
        if (!item) {
            $scope.listCheckbox.push({ id: id });
        }
        else {
            var index = $scope.listCheckbox.findIndex(x => x.id == id);
            $scope.listCheckbox.splice(index, 1);
        }
    }


    $scope.addorupdate = function () {
        var id_solicitud = $scope.id;
        var row = $scope.solicitudInventario.find(x => x.id == id_solicitud);
        $http.put(`${uriApi}/api/SolicitudInventarioBajas/${id_solicitud}`, {
            id: id_solicitud,
            id_solicitud: row.id_solicitud,
            fecha_solicitud: row.fecha_solicitud
        }).then(function (data) {
            for (var i = 0; i < $scope.listCheckbox.length; i++) {
                var id_articulo = $scope.listCheckbox[i].id;
                $scope.agregar(id_solicitud, id_articulo)
            }
            snackbar(strMensaje);
            $scope.Cancelar();
            $scope.GetSolicitudBajas();
            $scope.GetSolicitudBajasInventario();
        }).error(function (data) {
            snackbar(strMensajeError);
        });
    }
    $scope.agregar = function (id_solicitud, id_articulo) {
        $http.post(`${uriApi}/api/DetalleInventarioBajas`, {
            id_solicitud_inventario: id_solicitud,
            id_articulo: id_articulo
        });
    }

});


function soloNumeros(e) {
    var key = window.Event ? e.which : e.keyCode
    return ((key >= 48 && key <= 57))
}

function soloNumerosSueldo(e, numero) {
    var key = window.Event ? e.which : e.keyCode
    if (numero.includes(".")) {
        return ((key >= 48 && key <= 57))
    }
    else {
        return ((key >= 48 && key <= 57) || key == 46)
    }
}






//inventario
app.controller("marcas-controller", function ($scope, $http, $routeParams) {

    $http.get(`${uriApi}/api/TipoArticulos`).then((response) => {
        $scope.tipoarticulos = response.data;
    }).catch((error) => {
        snackbar(strMensajeError);
    });

    $scope.getMarcas = () => {
        $http.get(`${uriApi}/api/Marcas`).then((response) => {
            $scope.marcas = response.data;
        }).catch((error) => {
            snackbar(strMensajeError);
        });
    };
    $scope.changeTipo = () => {
        $scope.getMarcas();
        $scope.id = 0;
        $scope.marca = "";
        $scope.modelo = "";
    };



    $scope.Edit = function (id) {
        $http.get(`${uriApi}/api/Marcas/${id}`).then((response) => {
            $scope.id = response.data.id;
            $scope.marca = response.data.marca;
            $scope.modelo = response.data.modelo;

        }).catch((error) => {
            snackbar(strMensajeError);
        });

    }
    $scope.Limpiar = function () {
        $scope.id = 0;
        $scope.marca = "";
        $scope.modelo = "";
        $scope.id_tipo = function () {
            $scope.data.singleSelect = 'nonsense';
        };
        $scope.marcas = [];
    }
    $scope.addorupdate = function (id_estatus) {
        var Marca = {
            id: $scope.id,
            id_tipo: $scope.id_tipo.id,
            marca: $scope.marca,
            modelo: $scope.modelo,
        };
        $scope.id = 0;
        $scope.marca = "";
        $scope.modelo = "";

        $http.post(`${uriApi}/api/Marcas`, Marca).then(function (data) {
            snackbar(strMensaje);
            $http.get(`${uriApi}/api/Marcas`).then((response) => {
                $scope.marcas = response.data;

            }).catch((error) => {
                snackbar(strMensajeError);
            });
        }).error(function (data) {
            snackbar(strMensajeError);
        });
    }
    $scope.delete = (id) => {

        $http.delete(`${uriApi}/api/Marcas/${id}`).then((response) => {
            $scope.id = 0;
            $scope.marca = "";
            $scope.modelo = "";
            snackbar(strMensaje);
            $http.get(`${uriApi}/api/Marcas`).then((response) => {
                $scope.marcas = response.data;
            }).catch((error) => {
                snackbar(strMensajeError);
            });
        }).catch((error) => {
            snackbar(strMensajeError);
        });
    };
});
app.controller("modelos-controller", function ($scope, $http, $routeParams) {
    $http.get(`${uriApi}/api/Marcas`).then((response) => {
        $scope.marcas = response.data;
    }).catch((error) => {
        snackbar(strMensajeError);
    });



    $http.get(`${uriApi}/api/Modelos`).then((response) => {
        $scope.modelos = response.data;
    }).catch((error) => {
        snackbar(strMensajeError);
    });

    $scope.Edit = function (id) {
        $http.get(`${uriApi}/api/Modelos/${id}`).then((response) => {
            $scope.id = response.data.id;
            $scope.descripcion = response.data.descripcion;
            var index = $scope.marcas.find(x => x.id == response.data.id_marca);
            $scope.id_marca = index;
        }).catch((error) => {
            snackbar(strMensajeError);
        });
    }

    $scope.Limpiar = function () {
        $scope.id = 0;
        $scope.descripcion = "";
        $scope.id_marca = function () {
            $scope.data.singleSelect = 'nonsense';
        };
    }
    $scope.addorupdate = function () {
        var Modelo = {
            id: $scope.id,
            descripcion: $scope.descripcion,
            id_marca: $scope.id_marca.id,
        };
        $scope.Limpiar();
        $http.post(`${uriApi}/api/Modelos`, Modelo).then(function (data) {
            snackbar(strMensaje);
            $http.get(`${uriApi}/api/Modelos`).then((response) => {
                $scope.modelos = response.data;
            }).catch((error) => {
                snackbar(strMensajeError);
            });
        }).error(function (data) {
            snackbar(strMensajeError);
        });
    }
    $scope.delete = (id) => {

        $http.delete(`${uriApi}/api/Modelos/${id}`).then((response) => {
            $scope.id = 0;
            $scope.descripcion = "";
            snackbar(strMensaje);
            $http.get(`${uriApi}/api/Modelos`).then((response) => {
                $scope.modelos = response.data;
            }).catch((error) => {
                snackbar(strMensajeError);
            });
        }).catch((error) => {
            snackbar(strMensajeError);
        });
    };
});
app.controller("sistemas-controller", function ($scope, $http, $routeParams) {
    $http.get(`${uriApi}/api/SistemasOperativos`).then((response) => {
        $scope.sistemas = response.data;
    }).catch((error) => {
        snackbar(strMensajeError);
    });

    $scope.Limpiar = function () {
        $scope.id = 0;
        $scope.descripcion = "";
    }

    $scope.Edit = function (id) {
        $http.get(`${uriApi}/api/SistemasOperativos/${id}`).then((response) => {
            $scope.id = response.data.id;
            $scope.descripcion = response.data.descripcion;
            //var index = $scope.marcas.find(x => x.id == response.data.id_marca);
            //$scope.id_marca = index;

        }).catch((error) => {
            snackbar(strMensajeError);
        });
    }

    $scope.addorupdate = function (id_estatus) {
        var Sistemas = {
            id: $scope.id,
            descripcion: $scope.descripcion,
        };
        $scope.id = 0;
        $scope.descripcion = "";

        $http.post(`${uriApi}/api/SistemasOperativos`, Sistemas).then(function (data) {
            snackbar(strMensaje);

            $http.get(`${uriApi}/api/SistemasOperativos`).then((response) => {
                $scope.sistemas = response.data;
            }).catch((error) => {
                snackbar(strMensajeError);
            });
        }).error(function (data) {
            snackbar(strMensajeError);
        });
    }

    $scope.delete = (id) => {

        $http.delete(`${uriApi}/api/SistemasOperativos/${id}`).then((response) => {
            $scope.id = 0;
            $scope.descripcion = "";
            snackbar(strMensaje);
            $http.get(`${uriApi}/api/SistemasOperativos`).then((response) => {
                $scope.sistemas = response.data;
            }).catch((error) => {
                snackbar(strMensajeError);
            });
        }).catch((error) => {
            snackbar(strMensajeError);
        });
    };
});
app.controller("tipoarticulos-controller", function ($scope, $http, $routeParams) {
    $http.get(`${uriApi}/api/TipoArticulos`).then((response) => {
        $scope.tipoarticulos = response.data;
    }).catch((error) => {
        snackbar(strMensajeError);
    });

    $scope.Limpiar = function () {
        $scope.id = 0;
        $scope.descripcion = "";
    }

    $scope.Edit = function (id) {
        $http.get(`${uriApi}/api/TipoArticulos/${id}`).then((response) => {
            $scope.id = response.data.id;
            $scope.descripcion = response.data.descripcion;
        }).catch((error) => {
            snackbar(strMensajeError);
        });
    }

    $scope.addorupdate = function (id_estatus) {
        var Tipo = {
            id: $scope.id,
            descripcion: $scope.descripcion,
        };
        $scope.id = 0;
        $scope.descripcion = "";
        $http.post(`${uriApi}/api/TipoArticulos`, Tipo).then(function (data) {
            snackbar(strMensaje);

            $http.get(`${uriApi}/api/TipoArticulos`).then((response) => {
                $scope.tipoarticulos = response.data;
            }).catch((error) => {
                snackbar(strMensajeError);
            });
        }).error(function (data) {
            snackbar(strMensajeError);
        });
    }
    $scope.delete = (id) => {
        $http.delete(`${uriApi}/api/TipoArticulos/${id}`).then((response) => {
            snackbar(strMensaje);

            $http.get(`${uriApi}/api/TipoArticulos`).then((response) => {
                $scope.tipoarticulos = response.data;
            }).catch((error) => {
                snackbar(strMensajeError);
            });
        }).catch((error) => {
            snackbar(strMensajeError);
        });
    };
});




app.controller("articulos-controller", function ($scope, $http, $routeParams) {
    $scope.id = 0;
    $scope.blnEdit = false;

    $http.get(`${uriApi}/api/Filtros/getValor?tipo=14`).then((response) => {
        $scope.divisiones = response.data;
    });


    $http.get(`${uriApi}/api/Plantas`).then((response) => {
        $scope.plantas = response.data;
    });

    $http.get(`${uriApi}/api/EstatusArticulos`).then((response) => {
        $scope.estatus = response.data;
    });

    $http.get(`${uriApi}/api/SistemasOperativos`).then((response) => {
        $scope.sistemasoperativos = response.data;
    });

    $http.get(`${uriApi}/api/TipoArticulos`).then((response) => {
        $scope.tipoarticulos = response.data;
    });


    $scope.getMarcas = function () {
        $http.get(`${uriApi}/api/Marcas`).then((response) => {
            $scope.marcas = response.data;
        }).catch((error) => {
            snackbar(strMensajeError);
        });
    }
    $http.get(`${uriApi}/api/Marcas`).then((response) => {
        $scope.marcastabla = response.data;
    });
    mostrarspinner("Cargando..");
    $http.get(`${uriApi}/api/Articulos`).then((response) => {
        $scope.articulos = response.data;
        ocultarspinner();
    });

    $scope.asignarHijo = function (id) {
        location.href = '#!/AsignarHijo/' + id;
    }



    $scope.getTag = function () {
        $scope.etiqueta = "";
        if ($scope.id_division === undefined || $scope.no_serie.length < 5) {
            return
        }
        var strNoSerie = $scope.no_serie.toUpperCase();
        var strTag = strNoSerie.slice(-5);
        $scope.etiqueta = strTag + $scope.id_division.clave;
    }


    $scope.Editar = function (id) {
        $http.get(`${uriApi}/api/Articulos/${id}`).then((response) => {
            $scope.id = response.data.id;
            $scope.no_serie = response.data.no_serie;
            $scope.nombre_equipo = response.data.nombre_equipo;
            $scope.mac_address = response.data.mac_address;
            $scope.blnLeased = response.data.blnLeased;
            $scope.etiqueta = response.data.etiqueta;
            $scope.blnPadre = response.data.blnPadre;
            $scope.id = response.data.id;
            $scope.area = response.data.area;
            $scope.imei = response.data.imei;
            $scope.blnEdit = false;
            if (response.data.id_articulo_padre !== null) {
                $scope.blnEdit = true;
            }
            $http.get(`${uriApi}/api/Filtros?tipo=9&id=${id}`).then((response) => {
                if (response.data.length > 0) {
                    $scope.blnEdit = true;
                }
            });




            var indexdivision = $scope.divisiones.find(x => x.id == response.data.id_division);
            $scope.id_division = indexdivision;

            //var indexsubarticulos = $scope.subarticulos.find(x => x.id == response.data.id_subarticulo)

            var indextipo = $scope.tipoarticulos.find(x => x.id == response.data.id_tipo);
            $scope.id_tipo = indextipo;

            $http.get(`${uriApi}/api/Marcas`).then((responseMarca) => {
                $scope.marcas = responseMarca.data;
                var indexmarca = $scope.marcas.find(x => x.id == response.data.id_marca);
                $scope.id_marca = indexmarca;
            }).catch((error) => {
                snackbar(strMensajeError);
            });


            //$http.get(`${uriApi}/api/Modelos`).then((responseModelos) => {
            //    $scope.modelos = responseModelos.data;
            //    var indexmodelo = $scope.modelos.find(x => x.id == response.data.id_modelo);
            //    $scope.id_modelo = indexmodelo;
            //});

            var indexsistema = $scope.sistemasoperativos.find(x => x.id == response.data.id_sistema)
            $scope.id_sistema = indexsistema;

            var indexplanta = $scope.plantas.find(x => x.id == response.data.id_planta)
            $scope.id_planta = indexplanta;

            //var indexarea = $scope.areas.find(x => x.id == response.data.id_area)
            //$scope.id_area = indexarea;

        }).catch((error) => {
            snackbar(strMensajeError);
        });
    }




    $scope.changeTipo = function () {
        //if ($scope.id_tipo.id === 1 || $scope.id_tipo.id === 3 || $scope.id_tipo.id === 6) {
        //    $scope.nombredisabled = false;
        //}
        //else {
        //    $scope.nombredisabled = true;
        //}



        //if ($scope.id_tipo.id === 1 || $scope.id_tipo.id === 3 || $scope.id_tipo.id === 6 || $scope.id_tipo.id === 2 || $scope.id_tipo.id === 4 || $scope.id_tipo.id === 8 || $scope.id_tipo.id === 9) {
        //    $scope.macdisabled = false;
        //}
        //else {
        //    $scope.macdisabled = true;
        //}


        $scope.getMarcas();
    }


    //$scope.changeMarca = function () {
    //    $scope.GetModelos();
    //    $scope.getArticulos();
    //}
    //$scope.getArticulos = function () {
    //}
    $scope.addorupdate = function () {
        //var SubArticulo = {
        //    id_tipo: $scope.id_tipo.id,
        //    id_marca: $scope.id_marca.id,
        //    id_modelo: $scope.id_modelo.id,
        //};
        //$http.post(`${uriApi}/api/SubArticulos`, SubArticulo).then(function (data) {
        var id_sistema = null;
        if ($scope.id_sistema != undefined) {
            id_sistema = $scope.id_sistema.id;
        }

        var Articulo = {
            id: $scope.id,
            //id_subarticulo: data.data.id,
            no_serie: $scope.no_serie,
            id_sistema: id_sistema,
            no_serie: $scope.no_serie,
            imei: $scope.imei,
            nombre_equipo: $scope.nombre_equipo,
            mac_address: $scope.mac_address,
            id_division: $scope.id_division.id,
            area: $scope.area,
            blnLeased: $scope.blnLeased,
            etiqueta: $scope.etiqueta,
            id_planta: $scope.id_planta.id,
            blnPadre: $scope.blnPadre,
            id_tipo: $scope.id_tipo.id,
            id_marca: $scope.id_marca.id,
            //id_modelo: $scope.id_modelo.id,
        };
        $http.post(`${uriApi}/api/Articulos`, Articulo).then(function (data) {
            $scope.Limpiar();
            snackbar(strMensaje);


            $http.get(`${uriApi}/api/TipoArticulos`).then((response) => {
                $scope.tipoarticulos = response.data;
            }).catch((error) => {
                snackbar(strMensajeError);
            });

            $http.get(`${uriApi}/api/Marcas`).then((response) => {
                $scope.marcastabla = response.data;
            }).catch((error) => {
                snackbar(strMensajeError);
            });

            //$http.get(`${uriApi}/api/Modelos`).then((response) => {
            //    $scope.modelostabla = response.data;
            //}).catch((error) => {
            //    snackbar(strMensajeError);
            //});

            //$http.get(`${uriApi}/api/SubArticulos`).then((response) => {
            //    $scope.subarticulos = response.data;
            //}).catch((error) => {
            //    snackbar(strMensajeError);
            //});
            $http.get(`${uriApi}/api/Articulos`).then((response) => {
                $scope.articulos = response.data;
            }).catch((error) => {
                snackbar(strMensajeError);
            });
        }).error(function (data) {
            snackbar(strMensajeError);
        });

        //}).error(function (data) {
        //    snackbar(strMensajeError);
        //});
    }

    $scope.Limpiar = function () {
        $http.get(`${uriApi}/api/Divisiones`).then((response) => {
            $scope.divisiones = response.data;
        }).catch((error) => {
            snackbar(strMensajeError);
        });
        $scope.blnEdit = false;
        //$scope.nombredisabled = true;
        //$scope.macdisabled = true;
        $scope.id = 0;
        $scope.no_serie = "";
        $scope.imei = "";
        $scope.nombre_equipo = "";
        $scope.mac_address = "";
        $scope.area = "";
        $scope.id_marca = function () {
            $scope.data.singleSelect = 'nonsense';
        };
        $scope.id_tipo = function () {
            $scope.data.singleSelect = 'nonsense';
        };
        $scope.id_sistema = function () {
            $scope.data.singleSelect = 'nonsense';
        };
        $scope.id_planta = function () {
            $scope.data.singleSelect = 'nonsense';
        };
        //$scope.id_area = function () {
        //    $scope.data.singleSelect = 'nonsense';
        //};
        //$scope.id_division = function () {
        //    $scope.data.singleSelect = 'nonsense';
        //};
        $scope.etiqueta = "";
        $scope.blnLeased = false;
        $scope.blnPadre = false;
        //$scope.modelos = [];
    }
});



app.controller("baja-articulos-controller", function ($scope, $http, $routeParams) {

    $scope.blnArchivo = false;
    //Cargar al cargar la vista
    //Estatus 
    $http.get(`${uriApi}/api/EstatusArticulos`).then((response) => {
        $scope.estatus = response.data;
    });
    //Sistema operativo
    $http.get(`${uriApi}/api/SistemasOperativos`).then((response) => {
        $scope.sistemasoperativos = response.data;
    });
    //Tipo de equipos
    $http.get(`${uriApi}/api/TipoArticulos`).then((response) => {
        $scope.tipoarticulos = response.data;
    });
    //Marcas
    $http.get(`${uriApi}/api/Marcas`).then((response) => {
        $scope.marcas = response.data;
    });
    //Equipos
    mostrarspinner("Cargando...");
    $http.get(`${uriApi}/api/Articulos`).then((response) => {
        $scope.articulos = response.data;
        ocultarspinner();
    });
    //Descargar archivo
    $scope.Descargar = (id) => {
        $http.get(`${uriApi}/api/Articulos/${id}`).then((response) => {
            download(response.data.url, "archivo.pdf", "application/octet-stream;base64");
        });
    };








    $scope.Baja = (id) => {
        $scope.blnArchivo = true;
        $scope.id = id;
    };
    $scope.Cancelar = () => {
        $scope.blnArchivo = false;
        document.getElementById("file").value = "";
        $scope.comentarios = "";
        $scope.file = "";
        $scope.id = 0;
    };

    var media = null;
    $scope.blnDisable = false;
    $scope.DarDeBaja = () => {
        $http.get(`${uriApi}/api/Articulos/${$scope.id}`).then((response) => {
            response.data.id_estatus = 3;
            response.data.comentarios = $scope.comentarios;
            response.data.id_articulo_padre = null;
            response.data.url = media;

            $http.post(`${uriApi}/api/Articulos`, response.data).then(function (data) {
                //$scope.Cancelar();

                $http.get(`${uriApi}/api/Filtros?tipo=11&id=${$scope.id}`).then((response) => {

                    if (response.data.length > 0) {
                        response.data[0].blnActivo = false;
                        $http.post(`${uriApi}/api/EmpleadoArticulos/${$scope.id}`, response.data[0]).then(function (data) {
                            $http.get(`${uriApi}/api/Filtros?tipo=9&id=${id}`).then((response) => {
                                if (response.data.length > 0) {
                                    $scope.DesasignarArticulosHijos(0, response.data);
                                } else {
                                    $http.get(`${uriApi}/api/Articulos`).then((response) => {
                                        snackbar(strMensaje);
                                        $scope.blnArchivo = false;
                                        $scope.articulos = response.data;
                                    }).catch((error) => {
                                        snackbar(strMensajeError);
                                    });
                                }
                            });
                        }).error(function (data) {
                            snackbar(strMensajeError);
                        });
                    }
                    else {
                        $http.get(`${uriApi}/api/Filtros?tipo=9&id=${$scope.id}`).then((response) => {
                            if (response.data.length > 0) {
                                $scope.DesasignarArticulosHijos(0, response.data);
                            } else {
                                $http.get(`${uriApi}/api/Articulos`).then((response) => {
                                    snackbar(strMensaje);
                                    $scope.blnArchivo = false;
                                    $scope.articulos = response.data;
                                }).catch((error) => {
                                    snackbar(strMensajeError);
                                });
                            }
                        });
                    }

                });
            }).error(function (data) {
                snackbar(strMensajeError);
            });

        });
    };

    document.querySelector('#file').addEventListener('change', (ev) => {
        var arch = new FileReader();
        arch.addEventListener('load', (rv) => {
            base64 = rv.target.result;
            media = base64;
        }, false);
        arch.readAsDataURL(ev.target.files[0]);
    }, false);



    $scope.DesasignarArticulosHijos = (contador, envioResponse) => {
        envioResponse[contador].id_articulo_padre = null;
        $http.post(`${uriApi}/api/Articulos`, envioResponse[contador]).then(function (data) {
            contador++;
            if (contador < envioResponse.length) {
                $scope.DesasignarArticulosHijos(contador, envioResponse);
            }
            else {
                $http.get(`${uriApi}/api/Articulos`).then((response) => {
                    snackbar(strMensaje);
                    $scope.blnArchivo = false;
                    $scope.articulos = response.data;
                }).catch((error) => {
                    snackbar(strMensajeError);
                });
            }
        }).error(function (data) {
            snackbar(strMensajeError);
        });
    };

});

app.controller("asignar-equipo-controller", function ($scope, $http, $routeParams) {

    //Funciones para cargar informacion de inicio


    //Cargar al entrar en la vista

    $scope.blnGuardar = false;


    //Cargar al buscar empleado
    $scope.buscarEmpleado = function () {
        var numero_empleado = $scope.numero_empleado;
        //$http.get(`${uriApi}/api/Filtros/GetEmpleadosByNumeroEmpleado?numero_empleado=${numero_empleado}`).then(function (response) {
        $http.get(`${uriApi}/api/Filtros/getValor?tipo=4&id=${id_sistema_pantalla}&strValor=${numero_empleado}`).then(function (response) {

            if (response.data.length == 0) {
                snackbar("No se encontro el empleado o no tiene permisos para ver empleados de esta division");
                $scope.numero_empleado = "";
                $scope.nombre_empleado = "";
                $scope.articulosAgregados = [];
                $scope.articulosEmpleado = [];
                $scope.articulos = [];
                $scope.tipoarticulos = [];
                $scope.marcas = [];
                //$scope.modelos = [];
                $scope.subarticulos = [];
                $scope.articulosAgregados = [];
                $scope.articulosEmpleado = [];
            }
            else {
                $scope.nombre_empleado = response.data[0].NOMBRE + ' ' + response.data[0].APELLIDO1 + ' ' + response.data[0].APELLIDO2;
                $scope.getSubArticulos(response.data[0].IDCLIENTE);
                $scope.getArticulosEmpleados();
                $scope.getArticulosSinAsignar(response.data[0].IDCLIENTE);
                $scope.getTipoArticulo();
                $scope.getMarcas();
                //$scope.getModelos();

            }

        }).catch(function (response) {
            snackbar(strMensajeError);
        });
    }
    //Grupo de equipos por tipo y marca
    $scope.getSubArticulos = function (strDivision) {
        $http.get(`${uriApi}/api/Filtros?tipo=12&strValor=${strDivision}`).then((response) => {
            $scope.subarticulos = response.data;
        }).catch((error) => {
            snackbar(strMensajeError);
        });
    }
    //equipos por empleado
    $scope.getArticulosEmpleados = function () {
        var id = $scope.numero_empleado;


        $http.get(`${uriApi}/api/Filtros/getValor?tipo=5&id=${id}`).then(function (response) {
            $scope.articulosAgregados = response.data;
        }).catch(function (response) {
            snackbar(strMensajeError);
        });

        $http.get(`${uriApi}/api/Filtros/getValor?tipo=7&id=${id}`).then(function (response) {
            $scope.articulosEmpleado = response.data;
        }).catch(function (response) {
            snackbar(strMensajeError);
        });
    }
    //Articulos sin asignar
    $scope.getArticulosSinAsignar = function (strDivision) {
        $http.get(`${uriApi}/api/Filtros/getValor?tipo=3&id=1&strValor=${strDivision}`).then((response) => {
            $scope.articulos = response.data;
        }).catch((error) => {
            snackbar(strMensajeError);
        });
    }
    //Tipos de quipos
    $scope.getTipoArticulo = function () {
        $http.get(`${uriApi}/api/TipoArticulos`).then((response) => {
            $scope.tipoarticulos = response.data;
        }).catch((error) => {
            snackbar(strMensajeError);
        });
    }
    //Marcas
    $scope.getMarcas = function () {
        $http.get(`${uriApi}/api/Marcas`).then((response) => {
            $scope.marcas = response.data;
        }).catch((error) => {
            snackbar(strMensajeError);
        });
    }



    //Agregar y/o quitar equipos
    $scope.articulosAgregados = [];
    $scope.agregarEquipos = function () {
        for (var i = 0; i < $scope.equiposPorAgregar.length; i++) {
            var index = $scope.articulos.find(x => x.id == $scope.equiposPorAgregar[i]);
            var indexRegistro = $scope.articulos.findIndex(x => x.id == $scope.equiposPorAgregar[i])
            $scope.articulosAgregados.push(index);
            $scope.articulos.splice(indexRegistro, 1)

            $scope.agregarArticulosEmpleado($scope.equiposPorAgregar[i]);
        }
    }
    $scope.quitarEquipos = function () {
        for (var i = 0; i < $scope.equiposAgregados.length; i++) {
            var index = $scope.articulosAgregados.find(x => x.id == $scope.equiposAgregados[i]);
            var indexRegistro = $scope.articulosAgregados.findIndex(x => x.id == $scope.equiposAgregados[i])

            $scope.agregarArticulosEmpleado($scope.equiposAgregados[i]);
            $scope.articulos.push(index);
            $scope.articulosAgregados.splice(indexRegistro, 1)
        }
    }
    $scope.agregarArticulosEmpleado = function (id) {
        var index = $scope.articulosEmpleado.find(x => x.id_articulo == id);
        var indexRegistro = $scope.articulosEmpleado.findIndex(x => x.id_articulo == id);
        if (index == undefined) {
            $scope.articulosEmpleado.push({
                id: 0,
                numero_empleado: $scope.numero_empleado,
                nombre_empleado: $scope.nombre_empleado,
                id_articulo: id,
                FechaAlta: null,
                FechaBaja: null,
                blnActivo: true,
            });
        }
        else {
            if (index.id == 0) {
                $scope.articulosEmpleado.splice(indexRegistro, 1)
            } else {
                $scope.articulosEmpleado[indexRegistro].blnActivo = false;
            }
            var test = 0;
        }
        var test = 0;
    }


    //Guardar informacion
    $scope.addorupdate = function () {



        if ($scope.articulosEmpleado.length > 0) {
            $scope.blnGuardar = true;
            $scope.guardarEmpleadoArticulo(0);
        }
        else {
            snackbar("No se han quitado o agregado equipos");
        }
    }
    $scope.guardarEmpleadoArticulo = function (contador) {
        var EmpleadoArticulo = $scope.articulosEmpleado[contador];
        var idArticulo = EmpleadoArticulo.id_articulo;
        var id_estatus = 1;
        if (EmpleadoArticulo.blnActivo) {
            id_estatus = 2;
        }
        $http.post(`${uriApi}/api/EmpleadoArticulos/${idArticulo}`, EmpleadoArticulo).then(function (data) {

            $http.get(`${uriApi}/api/Articulos/${idArticulo}`).then((response) => {
                response.data.id_estatus = id_estatus
                $http.put(`${uriApi}/api/Articulos/${idArticulo}`, response.data).then(function (data) {
                    contador++;
                    if (contador < $scope.articulosEmpleado.length) {
                        $scope.guardarEmpleadoArticulo(contador);
                    }
                    else {
                        $scope.blnGuardar = false;
                        snackbar(strMensaje);
                        $scope.buscarEmpleado();
                    }

                }).error(function (data) {
                    snackbar(strMensajeError);
                });
            });
        }).error(function (data) {
            snackbar(strMensajeError);
        });
    }






    //Regresar a la ventana principal
    $scope.regresar = function () {
        location.href = '#!/Articulos';
    }





    $scope.test = function () {
        var strDiv = '<tr><td>Hola</td> </tr>';
        for (var i = 0; i < length; i++) {

        }

        Swal.fire({
            title: '<strong><u>Empleados</u></strong>',
            //type: 'info',
            html:
                '    <div style="overflow: scroll; height: 350px;" class="datagrid" onscroll="OnScrollDiv(this)">' +
                '<table class="table table-bordered">' +
                '<thead>' +
                '<tr>' +
                '    <th style="width:300px">Descripcion</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>' +
                strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv + strDiv +
                '</tbody>' +
                '</table>' +
                '</div>',
            showCloseButton: false,
            showCancelButton: false,
            showConfirmButton: false,
        })
    }


    //$scope.getModelos = function () {
    //    $http.get(`${uriApi}/api/Modelos`).then((response) => {
    //        $scope.modelos = response.data;
    //    }).catch((error) => {
    //        snackbar(strMensajeError);
    //    });
    //}
});
app.controller("asignar-hijos-controller", function ($scope, $http, $routeParams) {

    $scope.getTipoArticulo = function () {
        $http.get(`${uriApi}/api/TipoArticulos`).then((response) => {
            $scope.tipoarticulos = response.data;
        });
    }
    $scope.getMarcas = function () {
        $http.get(`${uriApi}/api/Marcas`).then((response) => {
            $scope.marcas = response.data;
        });
    }
    //Funciones para obtener informacion

    $scope.getArticulo = function () {
        $http.get(`${uriApi}/api/Articulos/${id}`).then((response) => {
            //var indexSubArticulo = $scope.subarticulos.find(x => x.id == response.data.id_subarticulo);
            //var indexTipo = $scope.tipoarticulos.find(x => x.id = response.data.id_tipo);
            //var indexMarca = $scope.marcas.find(x => x.id = response.data.id_marca);
            //var indexModelo = $scope.modelos.find(x => x.id = response.data.id_modelo);

            $scope.idTipo = response.data.id_tipo;
            $scope.idMarca = response.data.id_marca;
            $scope.idModelos = response.data.id_modelo;

            //grupo de Equipos por tipo y marca
            $scope.getSubArticulos(response.data.id_division);
            //Hijos
            $scope.getArticulosHijos();
            //Equipos sin padre
            $scope.getArticulosSinPadre(response.data.id_division);

            //$scope.nombre_equipo = indexTipo.descripcion + ' ' + indexMarca.descripcion + ' ' + indexModelo.descripcion;

        }).catch((error) => {
            snackbar(strMensajeError);
        });
    }

    $scope.getSubArticulos = function (id_division) {
        $http.get(`${uriApi}/api/Filtros?tipo=13&id=${id_division}`).then((response) => {
            $scope.subarticulos = response.data;
        });
    }
    $scope.getArticulosSinPadre = function (id_division) {
        $http.get(`${uriApi}/api/Filtros?tipo=10&id=${id_division}`).then((response) => {
            $scope.articulosinpadre = response.data;
        });
    }


    $scope.getArticulosHijos = function () {
        $http.get(`${uriApi}/api/Filtros?tipo=9&id=${id}`).then((response) => {
            $scope.articulohijos = response.data;
        });
    }

    //Cargar al entrar a la vista
    $scope.blnGuardar = false;
    var id = $routeParams.id;
    $scope.id = id;

    //Obtener
    //tipo de Equipos
    $scope.getTipoArticulo();
    //marca
    $scope.getMarcas();
    //Obtener Equipo
    $scope.getArticulo();



    //Regresar a la pagina de equipos
    $scope.regresar = function () {
        location.href = '#!/Articulos';
    }


    //$scope.getModelos = function () {
    //    $http.get(`${uriApi}/api/Modelos`).then((response) => {
    //        $scope.modelos = response.data;
    //    });
    //}


    //$scope.getModelos();






    $scope.articulosPorAgreOEli = [];
    //Esta funcion agrega el articulo o lo elimina de la lista para que por medio de esta lista se actualice si 
    //es tiene padre o se quito
    $scope.addListGuardar = function (index) {
        var indexExiste = $scope.articulosPorAgreOEli.find(x => x.id == index.id);
        if (indexExiste == undefined) {
            $scope.articulosPorAgreOEli.push(index);
        }
        else {
            var indexRegistro = $scope.articulosPorAgreOEli.findIndex(x => x.id == index.id);
            $scope.articulosPorAgreOEli.splice(indexRegistro, 1)
        }
    }
    $scope.agregarEquipos = function () {
        for (var i = 0; i < $scope.equiposPorAgregar.length; i++) {
            var index = $scope.articulosinpadre.find(x => x.id == $scope.equiposPorAgregar[i]);
            var indexRegistro = $scope.articulosinpadre.findIndex(x => x.id == $scope.equiposPorAgregar[i]);

            $scope.articulohijos.push(index);//Agrega articulos a la lista que van a ser hijos del articulo, esto es solo para la vista

            $scope.addListGuardar(index);//Agrega a la lista que va a guardar los datos ya sea si se agrego un articulo o se elimino

            $scope.articulosinpadre.splice(indexRegistro, 1)//Elimina el articulo que esta en la lista de los que no tienen padre
        }
    }
    $scope.quitarEquipos = function () {
        for (var i = 0; i < $scope.equiposAgregados.length; i++) {
            var index = $scope.articulohijos.find(x => x.id == $scope.equiposAgregados[i]);
            var indexRegistro = $scope.articulohijos.findIndex(x => x.id == $scope.equiposAgregados[i])

            $scope.articulosinpadre.push(index);//Agrega articulos a la lista que van a ser hijos del articulo, esto es solo para la vista
            $scope.addListGuardar(index);//Agrega a la lista que va a guardar los datos ya sea si se agrego un articulo o se elimino
            $scope.articulohijos.splice(indexRegistro, 1)//Elimina el articulo que esta en la lista de los que son hijos
        }
    }


    //Funciones para guardar
    $scope.addorupdate = function () {
        if ($scope.articulosPorAgreOEli.length > 0) {
            $scope.blnGuardar = true;
            $scope.guardar(0)
        }
        else {
            snackbar("No se han quitado o agregado equipos");
        }
    }
    $scope.guardar = function (contador) {
        var id_articulo = $scope.articulosPorAgreOEli[contador].id;
        if ($scope.articulosPorAgreOEli[contador].id_articulo_padre == null) {
            $scope.articulosPorAgreOEli[contador].id_articulo_padre = $scope.id;
        }
        else {
            $scope.articulosPorAgreOEli[contador].id_articulo_padre = null;
        }
        $http.put(`${uriApi}/api/Articulos/${id_articulo}`, $scope.articulosPorAgreOEli[contador]
        ).then(function (data) {


            contador++;
            if (contador < $scope.articulosPorAgreOEli.length) {
                $scope.guardar(contador);
            }
            else {
                $scope.blnGuardar = false;
                snackbar(strMensaje);

                $scope.articulosPorAgreOEli = [];
                $scope.getTipoArticulo();
                $scope.getMarcas();
                $scope.getModelos();
                $scope.getSubArticulos();

                setTimeout(function () {
                    $scope.getArticulo();
                    $scope.getArticulosHijos();
                    $scope.getArticulosSinPadre();
                }, 1500);




            }

        }).error(function (data) {
        });
    }

});





app.controller("consulta-equipo-controller", function ($scope, $http, $routeParams) {

    //Cargar al entrar en la vista

    $scope.blnGuardar = false;


    //Cargar al buscar empleado
    $scope.buscarEmpleado = function () {
        var numero_empleado = $scope.numero_empleado;
        //$http.get(`${uriApi}/api/Filtros/GetEmpleadosByNumeroEmpleado?numero_empleado=${numero_empleado}`).then(function (response) {
        $http.get(`${uriApi}/api/Filtros/getValor?tipo=4&id=${id_sistema_pantalla}&strValor=${numero_empleado}`).then(function (response) {

            if (response.data.length == 0) {
                snackbar("No se encontro el empleado o no tiene permisos para ver empleados de esta division");
                $scope.numero_empleado = "";
                $scope.nombre_empleado = "";

                $scope.articulos = [];
                $scope.tipoarticulos = [];
                $scope.marcas = [];
            }
            else {
                $scope.nombre_empleado = response.data[0].NOMBRE + ' ' + response.data[0].APELLIDO1 + ' ' + response.data[0].APELLIDO2;
                $scope.getArticulosEmpleados();
                $scope.getTipoArticulo();
                $scope.getMarcas();
                $scope.getEstatus();
                $scope.getSistemasOperativos();
                $scope.getDivisiones();
                //$scope.getModelos();

            }

        }).catch(function (response) {
            snackbar(strMensajeError);
        });
    }

    //equipos por empleado
    $scope.getArticulosEmpleados = function () {
        var id = $scope.numero_empleado;
        $http.get(`${uriApi}/api/Filtros/getValor?tipo=5&id=${id}`).then(function (response) {
            $scope.articulos = response.data;
        }).catch(function (response) {
            snackbar(strMensajeError);
        });
    }


    //Tipos de quipos
    $scope.getTipoArticulo = function () {
        $http.get(`${uriApi}/api/TipoArticulos`).then((response) => {
            $scope.tipoarticulos = response.data;
        }).catch((error) => {
            snackbar(strMensajeError);
        });
    }
    //Marcas
    $scope.getMarcas = function () {
        $http.get(`${uriApi}/api/Marcas`).then((response) => {
            $scope.marcas = response.data;
        }).catch((error) => {
            snackbar(strMensajeError);
        });
    }

    $scope.getEstatus = function () {

        $http.get(`${uriApi}/api/EstatusArticulos`).then((response) => {
            $scope.estatus = response.data;
        }).catch((error) => {
            snackbar(strMensajeError);
        });
    }

    $scope.getSistemasOperativos = function () {
        $http.get(`${uriApi}/api/SistemasOperativos`).then((response) => {
            $scope.sistemasoperativos = response.data;
        }).catch((error) => {
            snackbar(strMensajeError);
        });
    }

    $scope.getDivisiones = function () {
        $http.get(`${uriApi}/api/Divisiones`).then((response) => {
            $scope.divisiones = response.data;
        }).catch((error) => {
            snackbar(strMensajeError);
        });
    }



    //Regresar a la ventana principal
    $scope.regresar = function () {
        location.href = '#!/Articulos';
    }
});


app.controller("Inicio-Controller", function ($scope, $http, $routeParams) {
    $http.get(`${uriApi}/api/SistemaPantallas/${id_sistema_pantalla}`).then((response) => {
        $scope.sistemaPantalla = response.data;
    });
    $http.get(`${uriApi}/api/Sistemas/${id_sistema_pantalla}`).then((response) => {
        $scope.sistemas = response.data;
    });
});
app.controller("usuarios-sistemas-Controller", function ($scope, $http, $routeParams) {
    $scope.accion = "Crear Usuario";
    $scope.nuevo = true;
    $scope.id_usuario = 0;
    $scope.usuario = "";

    $http.get(`${uriApi}/api/FiltrosUsuarios/getValor?tipo=3&id1=${id_sistema_pantalla}`).then((response) => {
        $scope.usuarios = response.data;
    });

    $http.get(`${uriApi}/api/FiltrosUsuarios/getValor?tipo=6&id1=${id_sistema_pantalla}`).then((response) => {
        $scope.usuariosdivisiones = response.data;
    });



    $http.get(`${uriApi}/api/FiltrosUsuarios/getValor?tipo=1&id1=${id_sistema_pantalla}`).then(function (response) {
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


            $http.get(`${uriApi}/api/FiltrosUsuarios/getValor?tipo=2&id1=${id_sistema_pantalla}&id2=${id_usuario}`).then(function (response) {
                var Id_rol = "";
                if (response.data.length > 0) {
                    Id_rol = "" + response.data[0].Id_rol;
                }
                //$scope.myVar = Id_rol;
                var index = $scope.rolesporsistema.find(x => x.Id == Id_rol);
                $scope.rolusuario = index;

                $http.get(`${uriApi}/api/FiltrosUsuarios/getValor?tipo=5&id1=${id_sistema_pantalla}&strValor=${$scope.usuario}`).then(function (response) {
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
        $http.get(`${uriApi}/api/FiltrosUsuarios/getValor?tipo=1&id1=${id_sistema_pantalla}`).then(function (response) {
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
                    $http.delete(`${uriApi}/api/FiltrosUsuarios/delete?tipo=1&id1=${id_sistema_pantalla}&strValor=${usuario}`).then(function (response) {

                        $http.get(`${uriApi}/api/FiltrosUsuarios/getValor?tipo=2&id1=${id_sistema_pantalla}&id2=${id_usuario}`).then(function (response) {
                            var id_usuario_rol = response.data[0].Id;
                            $http.delete(`${uriApi}/api/UsuarioRoles/${id_usuario_rol}`).then(function (data) {

                                $scope.LimpiarUsuario();
                                snackbar(strMensaje);
                                $http.get(`${uriApi}/api/FiltrosUsuarios/getValor?tipo=3&id1=${id_sistema_pantalla}`).then((response) => {
                                    $scope.usuarios = response.data;
                                });



                                $http.get(`${uriApi}/api/FiltrosUsuarios/getValor?tipo=6&id1=${id_sistema_pantalla}`).then((response) => {
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

        var Usuario = {
            Id: $scope.id_usuario,
            Usuario: $scope.usuario,
            Email: $scope.correo
        };

        //Guardar y/o actualizar usuario
        $http.post(`${uriApi}/api/Usuarios`, Usuario).then(function (response) {

            $scope.id_usuario = response.data.Id;

            $http.get(`${uriApi}/api/FiltrosUsuarios/getValor?tipo=2&id1=${id_sistema_pantalla}&id2=${$scope.id_usuario}`).then(function (response) {

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
        }).error(function (data) {
            snackbar(strMensajeError);
        });
    }



    $scope.guardardivisiones = function (index) {
        if (index < usuarioDivisiones.length) {
            if (usuarioDivisiones[index].valor) {
                var usuariorol = {
                    id: usuarioDivisiones[index].id,
                    Usuario: $scope.usuario,
                    id_division: usuarioDivisiones[index].id_division,
                    id_sistema: id_sistema_pantalla,
                };

                $http.post(`${uriApi}/api/UsuarioDivisiones`, usuariorol).then(function (data) {
                    index++;

                    $scope.guardardivisiones(index);

                }).error(function (data) {
                    snackbar(strMensajeError);
                });


            }
            else {


                $http.delete(`${uriApi}/api/UsuarioDivisiones/${usuarioDivisiones[index].id}`, usuariorol).then(function (data) {
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
            $http.get(`${uriApi}/api/FiltrosUsuarios/getValor?tipo=3&id1=${id_sistema_pantalla}`).then((response) => {
                $scope.usuarios = response.data;
            });



            $http.get(`${uriApi}/api/FiltrosUsuarios/getValor?tipo=6&id1=${id_sistema_pantalla}`).then((response) => {
                $scope.usuariosdivisiones = response.data;
            });
        }
    }
});










var usuarioDivisiones = [];
function addordeletedivision(checkbox) {
    var blnValue = checkbox.checked;
    var id_division = checkbox.id.replace("chk-", "");
    var test = 0;
    var index = usuarioDivisiones.find(x => x.id_division == id_division);
    if (index === undefined) {

        usuarioDivisiones.push({ id: 0, id_division: id_division, valor: true, existe: 0 });
    }
    else {

        if (index.existe === 0) {
            var index = usuarioDivisiones.findIndex(x => x.id_division == id_division);
            usuarioDivisiones.splice(index, 1);
        }
        else {
            index.valor = blnValue;
        }
    }
}