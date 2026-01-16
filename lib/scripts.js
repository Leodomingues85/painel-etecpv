// URL de publicação da planilha como CSV
var urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR0Aes4529IBoRZAEDdX-whmdAqcFfMRLP71f2GAUbuuJZUERcuElwEWjL1pen9LuZ0ZavttjFlqWiF/pub?gid=0&single=true&output=csv";

// Variáveis para controle de som (tocar apenas se o número mudar)
var ultimaNormalVista = "";
var ultimaPrefVista = "";

jQuery(document).ready(function($) {

    function checarPlanilha() {
        // Cachebuster para evitar dados antigos do navegador
        var urlFinal = urlCSV + "&cachebuster=" + new Date().getTime();

        $.ajax({
            url: urlFinal,
            dataType: "text",
            cache: false,
            success: function(data) {
                if (!data || data.includes("html")) return;

                var colunas = data.split("\n")[0].split(",");
                
                // Limpeza dos dados vindo da planilha
                var senhaNormal = colunas[0] ? colunas[0].replace(/[Target"'\r\n]/g, '').trim() : "0000";
                var senhaPref = colunas[1] ? colunas[1].replace(/[Target"'\r\n]/g, '').trim() : "P000";

                // Atualização do campo NORMAL
                // Agora ele atualiza SEMPRE que for diferente do que está na tela (maior ou menor)
                if (senhaNormal !== ultimaNormalVista) {
                    $("#senhaNormalNumero").html(senhaNormal);
                    
                    // Toca o som apenas se não for a primeira carga da página
                    if (ultimaNormalVista !== "") tocarSom();
                    
                    ultimaNormalVista = senhaNormal;
                }

                // Atualização do campo PREFERENCIAL
                if (senhaPref !== ultimaPrefVista) {
                    $("#senhaPrefNumero").html(senhaPref);
                    
                    if (ultimaPrefVista !== "") tocarSom();
                    
                    ultimaPrefVista = senhaPref;
                }
            },
            error: function() {
                console.log("Erro ao acessar a planilha. Tentando novamente em 2 minutos.");
            }
        });
    }

    function tocarSom() {
        var audio = document.getElementById("audioChamada");
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            audio.play().catch(e => console.log("Clique na tela para liberar o áudio"));
        }
    }

    // Timer ajustado para 2 minutos (120.000 milissegundos)
    // 1000ms * 60s * 2 = 120.000
    setInterval(checarPlanilha, 120000);
    
    // Executa a primeira vez assim que abre a página
    checarPlanilha();
});
