// O link abaixo é o CSV público da sua planilha que você gerou no "Publicar na Web"
var urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR0Aes4529IBoRZAEDdX-whmdAqcFfMRLP71f2GAUbuuJZUERcuElwEWjL1pen9LuZ0ZavttjFlqWiF/pub?gid=0&single=true&output=csv";

var ultimaSenhaLida = "";

jQuery(document).ready(function($) {

    function checarPlanilha() {
        // O cachebuster adiciona a hora atual ao link. 
        // Isso obriga o navegador a buscar o dado real na internet em vez de usar uma cópia antiga do cache.
        var urlFinal = urlCSV + "&cachebuster=" + new Date().getTime();

        $.ajax({
            url: urlFinal,
            dataType: "text",
            cache: false,
            success: function(data) {
                // O Google Sheets envia o conteúdo da planilha como texto. 
                // Pegamos a primeira linha (index 0) e a primeira célula (antes da vírgula).
                var linhas = data.split("\n");
                var senhaNova = linhas[0].split(",")[0].replace(/"/g, '').trim();

                // Só executa a atualização se a senha for diferente da que já está na tela
                if (senhaNova !== "" && senhaNova !== ultimaSenhaLida) {
                    
                    // 1. Move a senha antiga para o campo "Última Chamada"
                    var senhaAntiga = $("#senhaAtualNumero").html();
                    if(senhaAntiga !== "0000") {
                        $("#ultimaSenhaNumero").html(senhaAntiga);
                    }
                    
                    // 2. Atualiza o número principal com a nova senha vinda da planilha
                    $("#senhaAtualNumero").html(senhaNova);
                    
                    // 3. Toca o efeito sonoro de chamada
                    var audio = document.getElementById("audioChamada");
                    if (audio) {
                        audio.pause(); // Para se já estiver tocando
                        audio.currentTime = 0; // Volta para o início
                        audio.play().catch(function(error) {
                            console.log("O áudio não pôde tocar automaticamente. Clique na página uma vez.");
                        });
                    }
                    
                    // 4. Salva a senha lida para evitar repetições no próximo ciclo
                    ultimaSenhaLida = senhaNova;
                }
            },
            error: function() {
                console.log("Erro ao conectar com a planilha do Google. Verificando novamente em instantes...");
            }
        });
    }

    // O sistema verifica a planilha a cada 3 segundos (3000ms).
    // Você pode diminuir para 2000ms se quiser mais rapidez, mas 3s é mais estável para a internet.
    setInterval(checarPlanilha, 3000);
    
    // Executa uma vez logo ao abrir a página
    checarPlanilha();
});