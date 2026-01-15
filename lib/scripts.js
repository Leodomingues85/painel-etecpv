var urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR0Aes4529IBoRZAEDdX-whmdAqcFfMRLP71f2GAUbuuJZUERcuElwEWjL1pen9LuZ0ZavttjFlqWiF/pub?gid=0&single=true&output=csv";

var maiorNormal = 0;
var maiorPref = 0;

jQuery(document).ready(function($) {
    function checarPlanilha() {
        // Usamos o timestamp e um número aleatório para garantir que o Google não mande lixo de cache
        var urlFinal = urlCSV + "&cachebuster=" + new Date().getTime() + "&random=" + Math.random();

        $.ajax({
            url: urlFinal,
            dataType: "text",
            cache: false,
            success: function(data) {
                if (!data || data.includes("html")) return; // Evita ler erro de página do Google

                var colunas = data.split("\n")[0].split(",");
                
                // Extração limpa apenas de números
                var textoNormal = colunas[0].replace(/[^\d]/g, '').trim();
                var textoPref = colunas[1] ? colunas[1].replace(/[^\d]/g, '').trim() : "";

                var numNormal = parseInt(textoNormal) || 0;
                var numPref = parseInt(textoPref) || 0;

                // Processa Normal e Preferencial de forma totalmente INDEPENDENTE
                
                // Verificação da Normal
                if (numNormal > maiorNormal) {
                    var formatado = numNormal.toString().padStart(4, '0');
                    $("#senhaNormalNumero").fadeOut(100, function() {
                        $(this).html(formatado).fadeIn(100);
                    });
                    maiorNormal = numNormal;
                    tocarSom();
                }

                // Verificação da Preferencial
                if (numPref > maiorPref) {
                    var formatadoP = "P" + numPref.toString().padStart(3, '0');
                    $("#senhaPrefNumero").fadeOut(100, function() {
                        $(this).html(formatadoP).fadeIn(100);
                    });
                    maiorPref = numPref;
                    tocarSom();
                }
            }
        });
    }

    function tocarSom() {
        var audio = document.getElementById("audioChamada");
        if (audio) { 
            audio.pause();
            audio.currentTime = 0; 
            audio.play().catch(e => console.log("Interação necessária para som")); 
        }
    }

    // Reduzimos o tempo para 2 segundos para ser mais responsivo
    setInterval(checarPlanilha, 2000);
    checarPlanilha();
});
