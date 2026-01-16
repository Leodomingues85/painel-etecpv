var urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR0Aes4529IBoRZAEDdX-whmdAqcFfMRLP71f2GAUbuuJZUERcuElwEWjL1pen9LuZ0ZavttjFlqWiF/pub?gid=0&single=true&output=csv";

var maiorNormal = -1; // Começa em -1 para aceitar o 0000
var maiorPref = -1;

jQuery(document).ready(function($) {
    function checarPlanilha() {
        var urlFinal = urlCSV + "&cachebuster=" + new Date().getTime();

        $.ajax({
            url: urlFinal,
            dataType: "text",
            cache: false,
            success: function(data) {
                if (!data || data.includes("html")) return;

                var colunas = data.split("\n")[0].split(",");
                
                // Pega os valores e limpa
                var textoNormal = colunas[0] ? colunas[0].replace(/[^\d]/g, '').trim() : "";
                var textoPref = colunas[1] ? colunas[1].replace(/[^\d]/g, '').trim() : "";

                var numNormal = textoNormal !== "" ? parseInt(textoNormal) : 0;
                var numPref = textoPref !== "" ? parseInt(textoPref) : 0;

                // SE A PLANILHA ESTIVER ZERADA (0 ou vazio), resetamos a memória local
                if (numNormal === 0 && maiorNormal > 0) maiorNormal = -1;
                if (numPref === 0 && maiorPref > 0) maiorPref = -1;

                // Lógica de Atualização Normal
                if (numNormal > maiorNormal || (numNormal === 0 && maiorNormal === -1)) {
                    var formatado = numNormal.toString().padStart(4, '0');
                    if($("#senhaNormalNumero").text() !== formatado) {
                        $("#senhaNormalNumero").html(formatado);
                        if(maiorNormal !== -1) tocarSom(); // Não toca som no primeiro carregamento se for 0
                        maiorNormal = numNormal;
                    }
                }

                // Lógica de Atualização Preferencial
                if (numPref > maiorPref || (numPref === 0 && maiorPref === -1)) {
                    var formatadoP = "P" + numPref.toString().padStart(3, '0');
                    if($("#senhaPrefNumero").text() !== formatadoP) {
                        $("#senhaPrefNumero").html(formatadoP);
                        if(maiorPref !== -1) tocarSom();
                        maiorPref = numPref;
                    }
                }
            }
        });
    }

    function tocarSom() {
        var audio = document.getElementById("audioChamada");
        if (audio) { 
            audio.pause();
            audio.currentTime = 0; 
            audio.play().catch(e => console.log("Interação necessária")); 
        }
    }

    setInterval(checarPlanilha, 3000);
    checarPlanilha();
});
