var urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR0Aes4529IBoRZAEDdX-whmdAqcFfMRLP71f2GAUbuuJZUERcuElwEWjL1pen9LuZ0ZavttjFlqWiF/pub?gid=0&single=true&output=csv";

var ultimaNormal = "";
var ultimaPref = "";

jQuery(document).ready(function($) {
    function checarPlanilha() {
        var urlFinal = urlCSV + "&cachebuster=" + new Date().getTime();

        $.ajax({
            url: urlFinal,
            dataType: "text",
            cache: false,
            success: function(data) {
                if (!data) return;
                var colunas = data.split("\n")[0].split(",");
                
                // Coluna A (Índice 0) = Normal | Coluna B (Índice 1) = Preferencial
                var senhaNormal = colunas[0].replace(/[Target"'\r\n]/g, '').trim();
                var senhaPref = colunas[1] ? colunas[1].replace(/[Target"'\r\n]/g, '').trim() : "";

                var mudou = false;

                // Verifica Normal
                if (senhaNormal !== "" && senhaNormal !== ultimaNormal) {
                    $("#senhaNormalNumero").html(senhaNormal);
                    ultimaNormal = senhaNormal;
                    mudou = true;
                }

                // Verifica Preferencial
                if (senhaPref !== "" && senhaPref !== ultimaPref) {
                    $("#senhaPrefNumero").html(senhaPref);
                    ultimaPref = senhaPref;
                    mudou = true;
                }

                // Se qualquer uma mudou, toca o som
                if (mudou) {
                    var audio = document.getElementById("audioChamada");
                    if (audio) { audio.currentTime = 0; audio.play(); }
                }
            }
        });
    }
    setInterval(checarPlanilha, 3000);
});
