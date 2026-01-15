var urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR0Aes4529IBoRZAEDdX-whmdAqcFfMRLP71f2GAUbuuJZUERcuElwEWjL1pen9LuZ0ZavttjFlqWiF/pub?gid=0&single=true&output=csv";

// Armazena o valor numérico puro para comparação
var maiorNormal = 0;
var maiorPref = 0;

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
                
                // Limpeza e captura dos valores
                var textoNormal = colunas[0].replace(/[^\d]/g, '').trim(); // Pega só números
                var textoPref = colunas[1] ? colunas[1].replace(/[^\d]/g, '').trim() : "";

                var numNormal = parseInt(textoNormal) || 0;
                var numPref = parseInt(textoPref) || 0;

                var mudou = false;

                // LÓGICA ANTI-RETROCESSO PARA NORMAL
                if (numNormal > maiorNormal) {
                    var formatado = numNormal.toString().padStart(4, '0');
                    $("#senhaNormalNumero").html(formatado);
                    maiorNormal = numNormal;
                    mudou = true;
                    console.log("Nova Normal aceita: " + formatado);
                }

                // LÓGICA ANTI-RETROCESSO PARA PREFERENCIAL
                if (numPref > maiorPref) {
                    var formatadoP = "P" + numPref.toString().padStart(3, '0');
                    $("#senhaPrefNumero").html(formatadoP);
                    maiorPref = numPref;
                    mudou = true;
                    console.log("Nova Preferencial aceita: " + formatadoP);
                }

                // Toca o som apenas se houve um avanço real
                if (mudou) {
                    var audio = document.getElementById("audioChamada");
                    if (audio) { 
                        audio.pause();
                        audio.currentTime = 0; 
                        audio.play().catch(e => console.log("Aguardando interação")); 
                    }
                }
            }
        });
    }

    // Checa a cada 3 segundos
    setInterval(checarPlanilha, 3000);
    checarPlanilha();
});



