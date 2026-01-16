// URL de publicação da planilha como CSV
var urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR0Aes4529IBoRZAEDdX-whmdAqcFfMRLP71f2GAUbuuJZUERcuElwEWjL1pen9LuZ0ZavttjFlqWiF/pub?gid=0&single=true&output=csv";

// Variáveis para saber se o número realmente mudou e tocar o som
var memoriaNormal = "";
var memoriaPref = "";

jQuery(document).ready(function($) {

    function checarPlanilha() {
        // Cachebuster robusto para evitar atrasos do Google
        var urlFinal = urlCSV + "&cachebuster=" + new Date().getTime() + "&r=" + Math.random();

        $.ajax({
            url: urlFinal,
            dataType: "text",
            cache: false,
            success: function(data) {
                if (!data || data.includes("html")) return;

                var linhas = data.split("\n");
                var colunas = linhas[0].split(",");
                
                // 1. Processamento da Senha NORMAL
                var dadoNormal = colunas[0] ? colunas[0].replace(/[Target"'\r\n]/g, '').trim() : "";
                // Se a planilha estiver vazia ou com "0", define como 0000
                var senhaNormalFinal = (dadoNormal === "" || dadoNormal === "0") ? "0000" : dadoNormal;

                if (senhaNormalFinal !== memoriaNormal) {
                    $("#senhaNormalNumero").html(senhaNormalFinal);
                    // Toca o som apenas se não for a primeira vez que a página abre
                    if (memoriaNormal !== "") tocarSom();
                    memoriaNormal = senhaNormalFinal;
                }

                // 2. Processamento da Senha PREFERENCIAL
                var dadoPref = colunas[1] ? colunas[1].replace(/[Target"'\r\n]/g, '').trim() : "";
                // Se a planilha estiver vazia ou com "0", define como P000
                var senhaPrefFinal = (dadoPref === "" || dadoPref === "0") ? "P000" : dadoPref;

                if (senhaPrefFinal !== memoriaPref) {
                    $("#senhaPrefNumero").html(senhaPrefFinal);
                    if (memoriaPref !== "") tocarSom();
                    memoriaPref = senhaPrefFinal;
                }
            },
            error: function() {
                console.log("Erro de conexão. Tentando novamente em 15 segundos.");
            }
        });
    }

    function tocarSom() {
        var audio = document.getElementById("audioChamada");
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            audio.play().catch(e => console.log("Clique na tela uma vez para ativar o áudio da TV."));
        }
    }

    // Intervalo definido para 15 segundos (5000 milissegundos)
    setInterval(checarPlanilha, 5000);
    
    // Execução imediata ao carregar
    checarPlanilha();
});

