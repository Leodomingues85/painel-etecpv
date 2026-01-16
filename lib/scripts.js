// script.js
// URL DO CSV (Mantenha a sua URL original aqui)
var urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR0Aes4529IBoRZAEDdX-whmdAqcFfMRLP71f2GAUbuuJZUERcuElwEWjL1pen9LuZ0ZavttjFlqWiF/pub?gid=0&single=true&output=csv";

var memoriaNormal = "";
var memoriaPref = "";

function checarPlanilha() {
    // Adicionamos parâmetros aleatórios para tentar burlar o cache do navegador e do Google
    var urlFinal = urlCSV + "&t=" + new Date().getTime() + "&r=" + Math.random();

    $.ajax({
        url: urlFinal,
        dataType: "text",
        cache: false,
        timeout: 10000, 
        success: function(data) {
            if (!data || data.includes("<html")) return; // Proteção contra erros de download

            // Atualiza Relógio
            var agora = new Date();
            var hora = agora.toLocaleTimeString('pt-BR');
            $("#last-sync").text(hora);

            var linhas = data.split(/\r\n|\n/);
            var colunas = linhas[0].split(",");

            // --- TRATAMENTO DA SENHA NORMAL ---
            // Remove tudo que não for dígito e garante 4 digitos
            var rawNormal = colunas[0] ? colunas[0].replace(/\D/g, '') : "0"; 
            var senhaNormalFinal = rawNormal.padStart(4, '0');

            if (senhaNormalFinal !== memoriaNormal && senhaNormalFinal !== "0000") {
                $("#senhaNormalNumero").text(senhaNormalFinal);
                
                // Só toca o som se não for a primeira carga da página
                if (memoriaNormal !== "") { 
                    tocarSom(); 
                    // Efeito visual de piscar
                    $(".card-normal").fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
                }
                memoriaNormal = senhaNormalFinal;
            }

            // --- TRATAMENTO DA SENHA PREFERENCIAL ---
            var rawPref = colunas[1] ? colunas[1].replace(/\D/g, '') : "0";
            var senhaPrefFinal = "P" + rawPref.padStart(3, '0');

            if (senhaPrefFinal !== memoriaPref && senhaPrefFinal !== "P000") {
                $("#senhaPrefNumero").text(senhaPrefFinal);
                
                if (memoriaPref !== "") { 
                    tocarSom();
                    $(".card-pref").fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
                }
                memoriaPref = senhaPrefFinal;
            }
        },
        error: function() {
            $("#last-sync").html("<span style='color:red'>Reconectando...</span>");
        }
    });
}

function tocarSom() {
    var audio = document.getElementById("audioChamada");
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
        var playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Autoplay bloqueado pelo navegador. Interaja com a página primeiro.");
            });
        }
    }
}

$(document).ready(function() {
    setInterval(checarPlanilha, 5000); // Verifica a cada 5 segundos
    checarPlanilha();
});
