// script.js - VERSÃO FIREBASE (REALTIME)

// --- COLE SUA CONFIGURAÇÃO DO FIREBASE ABAIXO ---
// (Substitua tudo entre as chaves pelo que você copiou do console)
const firebaseConfig = {

  apiKey: "AIzaSyBah5LjXxzoSayt3N0BjZXQvqnU0blS2jw",

  authDomain: "painelsenha-9d916.firebaseapp.com",

  databaseURL: "https://painelsenha-9d916-default-rtdb.firebaseio.com",

  projectId: "painelsenha-9d916",

  storageBucket: "painelsenha-9d916.firebasestorage.app",

  messagingSenderId: "769541307537",

  appId: "1:769541307537:web:6015b9301dac2b78631330"

};

// ------------------------------------------------

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

var memoriaNormal = "";
var memoriaPref = "";

// ESCUTA O BANCO DE DADOS EM TEMPO REAL
// O Firebase avisa automaticamente quando algo mudar. Não precisa de setInterval.
database.ref('chamada').on('value', (snapshot) => {
    const data = snapshot.val();
    
    if (data) {
        atualizarTela(data.normal, data.preferencial);
        
        // Atualiza a hora da última sincronização
        var agora = new Date();
        $("#last-sync").text(agora.toLocaleTimeString('pt-BR'));
    }
});

function atualizarTela(numNormal, numPref) {
    // Tratamento Normal
    let normalFormatado = (numNormal || 0).toString().padStart(4, '0');
    
    if (normalFormatado !== memoriaNormal && normalFormatado !== "0000") {
        $("#senhaNormalNumero").text(normalFormatado);
        if (memoriaNormal !== "") { // Só toca se não for a primeira carga
            tocarSom();
            animarCard(".card-normal");
        }
        memoriaNormal = normalFormatado;
    }

    // Tratamento Preferencial
    let prefFormatado = "P" + (numPref || 0).toString().padStart(3, '0');

    if (prefFormatado !== memoriaPref && prefFormatado !== "P000") {
        $("#senhaPrefNumero").text(prefFormatado);
        if (memoriaPref !== "") { 
            tocarSom();
            animarCard(".card-pref");
        }
        memoriaPref = prefFormatado;
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
        audio.play().catch(e => console.log("Som requer interação prévia"));
    }
}
