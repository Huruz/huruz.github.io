// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict';
    window.addEventListener('load', function () {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');

        document.getElementById("rfc").required = false;

        $('#nombre').val(null);
        $('#email').val(null);
        $('#institucion').val("");
        $('#rfc').val(null);
        $('#SSY').hide();

        // Loop over them and prevent submission
        $('#registrarBtn').on("click", function () {
            var validation = Array.prototype.filter.call(forms, function (form) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                    console.log("No válido");
                } else {
                    var rfc;
                    if (document.getElementById("rfc").required === true && $('#institucion').val() === "ssy" && $('#rfc').val() != null && $('#rfc').val() != "") {
                        rfc = $('#rfc').val();
                    } else {
                        rfc = "NULL";
                    }
                    var dataForm = {
                        "nombre": $('#nombre').val(),
                        "email": $('#email').val(),
                        "institucion": $('#institucion').val(),
                        "rfc": rfc
                    };
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
                }
                form.classList.add('was-validated');
            }, false);
        });
    });
})();

function mostrarExtras(combo) {
    var tipo = $(combo).children("option:selected").val();
    var rfc = document.getElementById("rfc");
    if (tipo == "ssy") {
        $('#SSY').show();
        rfc.required = true;
    } else {
        $('#SSY').hide();
        rfc.required = false;
        $(rfc).val(null);
    }
}
