// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict';
    window.addEventListener('load', function () {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');

        $('#nombre').val(null);
        $('#apellido').val(null);
        $('#email').val(null);
        $('#estado').val("");
        $('#nvl').val(null);
        $('#profesion').val(null);
        $('#cargo').val(null);
        $('#institucion').val("");

        // Loop over them and prevent submission
        $('#registrarBtn').on("click", function () {
            var validation = Array.prototype.filter.call(forms, function (form) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                    console.log("No válido");
                } else {
                    var dataForm = {
                        "nombre": $('#nombre').val(),
                        "apellido": $('#apellido').val(),
                        "email": $('#email').val(),
                        "estado": $("#estado option:selected").text(),
                        "nivel": $('#nvl').val(),
                        "profesion": $('#profesion').val(),
                        "cargo": $('#cargo').val(),
                        "institucion": $("#institucion option:selected").text(),
                    };
                    alert(dataForm);
                    console.log(dataForm);
                    /*
                    $.ajax({
                        // En data puedes utilizar un objeto JSON, un array o un query string
                        data: dataForm,
                        type: "POST",
                        url: "http://www.jornadacecas.xyz/inscribir.php"
                    })
                    .done(function( data, textStatus, jqXHR ) {
                        $('#alerta').text(data.msg);
                        if ( console && console.log ) {
                            alert("Mensaje: "+data.msg);
                            console.log(data.msg);
                        }

                        setTimeout(function(){
                            $('#modalForm').modal('hide');
                        },5000);
                    })
                    .fail(function( jqXHR, textStatus, errorThrown ) {
                        $('#alerta').text(textStatus);
                        if ( console && console.log ) {
                            console.log( "La solicitud a fallado: " +  textStatus);
                        }
                        setTimeout(function(){
                            $('#modalForm').modal('hide');
                        },5000);
                    });
                    */
                }
                form.classList.add('was-validated');
            }, false);
        });
    });
})();