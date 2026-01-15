// Verifique se este link é o seu link de "Publicar na Web" como CSV
var urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR0Aes4529IBoRZAEDdX-whmdAqcFfMRLP71f2GAUbuuJZUERcuElwEWjL1pen9LuZ0ZavttjFlqWiF/pub?gid=0&single=true&output=csv";

var ultimaSenhaLida = "";

jQuery(document).ready(function($) {

    function checarPlanilha() {
        // O cachebuster com milissegundos evita que o navegador leia versões antigas
        var urlFinal = urlCSV + "&cachebuster=" + new Date().getTime();

        $.ajax({
            url: urlFinal,
            dataType: "text",
            cache: false, // Força o navegador a não guardar cache
            success: function(data) {
                if (!data) return;

                var linhas = data.split("\n");
                // Pega a célula A1, remove aspas e espaços extras
                var senhaPlanilha = linhas[0].split(",")[0].replace(/[Target"'\r]/g, '').trim();

                // SÓ ATUALIZA SE: 
                // 1. A senha da planilha não estiver vazia
                // 2. A senha for DIFERENTE da que já está na tela da TV
                if (senhaPlanilha !== "" && senhaPlanilha !== ultimaSenhaLida) {
                    
                    console.log("Nova senha detectada: " + senhaPlanilha);

                    // 1. O número atual da tela vira a "Última Chamada"
                    var senhaQueJaEstavaNaTela = $("#senhaAtualNumero").text();
                    if(senhaQueJaEstavaNaTela !== "0000" && senhaQueJaEstavaNaTela !== "") {
                        $("#ultimaSenhaNumero").html(senhaQueJaEstavaNaTela);
                    }
                    
                    // 2. Atualiza a tela com a senha nova
                    $("#senhaAtualNumero").html(senhaPlanilha);
                    
                    // 3. Toca o som
                    var audio = document.getElementById("audioChamada");
                    if (audio) {
                        audio.pause();
                        audio.currentTime = 0;
                        audio.play().catch(e => console.log("Aguardando interação para áudio."));
                    }
                    
                    // 4. Grava que esta é a última senha lida para não repetir
                    ultimaSenhaLida = senhaPlanilha;
                }
            },
            error: function() {
                console.log("Tentando reconectar à nuvem...");
            }
        });
    }

    // Verifica a cada 3 segundos. 
    // Não coloque menos que 2 segundos para não sobrecarregar a cota do Google.
    setInterval(checarPlanilha, 3000);
    
    // Chamada inicial
    checarPlanilha();
});
