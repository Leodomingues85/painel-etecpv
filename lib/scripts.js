var urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR0Aes4529IBoRZAEDdX-whmdAqcFfMRLP71f2GAUbuuJZUERcuElwEWjL1pen9LuZ0ZavttjFlqWiF/pub?gid=0&single=true&output=csv";

var memoriaNormal = "";
var memoriaPref = "";

jQuery(document).ready(function($) {

    function checarPlanilha() {
        var urlFinal = urlCSV + "&cachebuster=" + new Date().getTime() + "&r=" + Math.random();

        $.ajax({
            url: urlFinal,
            dataType: "text",
            cache: false,
            timeout: 8000, 
            success: function(data) {
                if (!data || data.includes("<!DOCTYPE html>")) return;

                // ATUALIZA O HORÁRIO NA TELA
                var agora = new Date();
                var horaFormatada = agora.getHours().toString().padStart(2, '0') + ":" + 
                                   agora.getMinutes().toString().padStart(2, '0') + ":" + 
                                   agora.getSeconds().toString().padStart(2, '0');
                $("#last-sync").html(horaFormatada);

                var linhas = data.split("\n");
                var colunas = linhas[0].split(",");
                
                // Processamento Normal
                var dadoNormal = colunas[0] ? colunas[0].replace(/[Target"'\r\n]/g, '').trim() : "";
                var senhaNormalFinal = (dadoNormal === "" || dadoNormal === "0") ? "0000" : dadoNormal;

                if (senhaNormalFinal !== memoriaNormal) {
                    $("#senhaNormalNumero").html(senhaNormalFinal);
                    if (memoriaNormal !== "") tocarSom();
                    memoriaNormal = senhaNormalFinal;
                }

                // Processamento Preferencial
                var dadoPref = colunas[1] ? colunas[1].replace(/[Target"'\r\n]/g, '').trim() : "";
                var senhaPrefFinal = (dadoPref === "" || dadoPref === "0") ? "P000" : dadoPref;

                if (senhaPrefFinal !== memoriaPref) {
                    $("#senhaPrefNumero").html(senhaPrefFinal);
                    if (memoriaPref !== "") tocarSom();
                    memoriaPref = senhaPrefFinal;
                }
            },
            error: function() {
                $("#last-sync").html("<span style='color:red'>Erro de Conexão</span>");
            }
        });
    }

    function tocarSom() {
        var audio = document.getElementById("audioChamada");
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            audio.play().catch(e => {});
        }
    }

    // Mantendo os 15 segundos solicitados
    setInterval(checarPlanilha, 15000);
    checarPlanilha();
});
