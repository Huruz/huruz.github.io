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
        $('#ISSSTE').hide();

        // Loop over them and prevent submission
        $('#registrarBtn').on("click", function () {
            var validation = Array.prototype.filter.call(forms, function (form) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                    console.log("No válido");
                } else {
                    var rfc;
                    if (document.getElementById("rfc").required === true && $('#institucion').val() === "ISSSTE" && $('#rfc').val() != null && $('#rfc').val() != "") {
                        rfc = $('#rfc').val();
                    } else {
                        rfc = null;
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
                        url: "http://localhost/send.php",
                    })
                    .done(function( data, textStatus, jqXHR ) {
                        if ( console && console.log ) {
                            alert("Nuevo registro: "+data.name+", "+data.email+", "+data.institution+", "+data.validated);
                            console.log(data);
                        }
                    })
                    .fail(function( jqXHR, textStatus, errorThrown ) {
                        if ( console && console.log ) {
                            console.log( "La solicitud a fallado: " +  textStatus);
                        }
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
    if (tipo == "ISSSTE") {
        $('#ISSSTE').show();
        rfc.required = true;
    } else {
        $('#ISSSTE').hide();
        rfc.required = false;
        $(rfc).val(null);
    }
}
