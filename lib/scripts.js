// script.js - VERSÃO FINAL (DWEET)
// Mantenha esta chave igual no controle
var ID_ESCOLA = "etec-pv-2026-oficial"; 

var memoriaNormal = "";
var memoriaPref = "";

function checarNuvem() {
    // Adiciona o timestamp para evitar cache
    var url = "https://dweet.io/get/latest/dweet/for/" + ID_ESCOLA + "?r=" + Math.random();

    $.ajax({
        url: url,
        dataType: "json",
        cache: false,
        timeout: 5000,
        success: function(response) {
            if (response && response.with && response.with.length > 0) {
                var dados = response.with[0].content;
                atualizarTela(dados.normal, dados.pref);
                
                // Atualiza relógio
                var agora = new Date();
                $("#last-sync").html(agora.toLocaleTimeString('pt-BR'));
            }
        },
        error: function() {
            console.log("Tentando reconectar...");
        }
    });
}

function atualizarTela(numNormal, numPref) {
    // Tratamento Normal
    var valNormal = numNormal ? parseInt(numNormal) : 0;
    var textoNormal = valNormal.toString().padStart(4, '0');

    if (textoNormal !== memoriaNormal && textoNormal !== "0000") {
        $("#senhaNormalNumero").text(textoNormal);
        if (memoriaNormal !== "") { tocarSom(); animarCard(".card-normal"); }
        memoriaNormal = textoNormal;
    }

    // Tratamento Preferencial
    var valPref = numPref ? parseInt(numPref) : 0;
    var textoPref = "P" + valPref.toString().padStart(3, '0');

    if (textoPref !== memoriaPref && textoPref !== "P000") {
        $("#senhaPrefNumero").text(textoPref);
        if (memoriaPref !== "") { tocarSom(); animarCard(".card-pref"); }
        memoriaPref = textoPref;
    }
}

function animarCard(seletor) {
    $(seletor).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
}

function tocarSom() {
    var audio = document.getElementById("audioChamada");
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.play().catch(e => console.log("Som bloqueado até interação"));
    }
}

$(document).ready(function() {
    setInterval(checarNuvem, 1000); // Verifica a cada 1 segundo
    checarNuvem();
});
