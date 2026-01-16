// script.js (PAINEL - TV)
// A chave única do seu evento
var ID_EVENTO = "etec-pv-matricula-2026-oficial"; 

var memoriaNormal = "";
var memoriaPref = "";

function buscarNuvem() {
    // Busca o status atual
    $.ajax({
        url: "https://dweet.io/get/latest/dweet/for/" + ID_EVENTO + "?r=" + Math.random(),
        dataType: "json",
        cache: false,
        timeout: 3000,
        success: function(response) {
            if (response && response.with && response.with.length > 0) {
                var dados = response.with[0].content;
                atualizarTela(dados.normal, dados.pref);
                
                // Atualiza indicador de conexão
                var agora = new Date();
                $("#last-sync").html(agora.toLocaleTimeString('pt-BR') + " <span style='color:green; font-size:10px'>● Online</span>");
            }
        },
        error: function() {
            $("#last-sync").html("<span style='color:red'>Reconectando...</span>");
        }
    });
}

function atualizarTela(n, p) {
    // Normal
    var txtN = (parseInt(n) || 0).toString().padStart(4, '0');
    if (txtN !== memoriaNormal && txtN !== "0000") {
        $("#senhaNormalNumero").text(txtN);
        if (memoriaNormal !== "") { tocarSom(); animar(".card-normal"); }
        memoriaNormal = txtN;
    }

    // Preferencial
    var txtP = "P" + (parseInt(p) || 0).toString().padStart(3, '0');
    if (txtP !== memoriaPref && txtP !== "P000") {
        $("#senhaPrefNumero").text(txtP);
        if (memoriaPref !== "") { tocarSom(); animar(".card-pref"); }
        memoriaPref = txtP;
    }
}

function animar(div) {
    $(div).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
}

function tocarSom() {
    var audio = document.getElementById("audioChamada");
    if (audio) {
        audio.pause(); audio.currentTime = 0;
        audio.play().catch(e => console.log("Interaja com a página"));
    }
}

$(document).ready(function() {
    setInterval(buscarNuvem, 1000); // TV atualiza a cada 1s
    buscarNuvem();
});
