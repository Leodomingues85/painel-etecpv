// Link de publicação da planilha como CSV
var urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR0Aes4529IBoRZAEDdX-whmdAqcFfMRLP71f2GAUbuuJZUERcuElwEWjL1pen9LuZ0ZavttjFlqWiF/pub?gid=0&single=true&output=csv";

var ultimaSenhaLida = "";

jQuery(document).ready(function($) {

    function checarPlanilha() {
        // O cachebuster força o navegador a buscar um dado novo do servidor
        var urlFinal = urlCSV + "&cachebuster=" + new Date().getTime();

        $.ajax({
            url: urlFinal,
            dataType: "text",
            cache: false,
            success: function(data) {
                if (!data) return;

                var linhas = data.split("\n");
                // Remove aspas, espaços e caracteres de retorno (limpeza total)
                var senhaPlanilha = linhas[0].split(",")[0].replace(/[Target"'\r\n]/g, '').trim();

                // SÓ ATUALIZA SE:
                // 1. A senha não estiver vazia
                // 2. A senha for DIFERENTE da que já está aparecendo na tela agora
                if (senhaPlanilha !== "" && senhaPlanilha !== ultimaSenhaLida) {
                    
                    // Move a senha atual para o campo de "Última Chamada"
                    var senhaAntiga = $("#senhaAtualNumero").text();
                    if(senhaAntiga !== "0000" && senhaAntiga !== "") {
                        $("#ultimaSenhaNumero").html(senhaAntiga);
                    }
                    
                    // Atualiza o painel com a senha nova
                    $("#senhaAtualNumero").html(senhaPlanilha);
                    
                    // Toca o som de chamada
                    var audio = document.getElementById("audioChamada");
                    if (audio) {
                        audio.pause();
                        audio.currentTime = 0;
                        audio.play().catch(e => console.log("Clique na tela para ativar o som"));
                    }
                    
                    // Trava: memoriza que esta senha já foi processada
                    ultimaSenhaLida = senhaPlanilha;
                }
            }
        });
    }

    // Verifica a planilha a cada 3 segundos
    setInterval(checarPlanilha, 3000);
    checarPlanilha();
});
