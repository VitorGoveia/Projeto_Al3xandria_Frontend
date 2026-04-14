const API_BASE_URL = 'http://127.0.0.1:5001';

// =============================================
// Gerenciamento de Token e Sessão
// =============================================

function getToken() {
    return localStorage.getItem('token');
}

function getUserId() {
    return localStorage.getItem('user_id');
}

function removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
}

// =============================================
// Logout
// =============================================

function logout() {
    removeToken();
    alert('Logout realizado com sucesso!');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

// =============================================
// Inicialização
// =============================================

document.addEventListener('DOMContentLoaded', function () {

    // Protege a página: se não estiver logado, volta para o login
    if (!getToken() || !getUserId()) {
        alert('Você precisa fazer login primeiro.');
        window.location.href = 'login.html';
        return;
    }

    const btnSair = document.getElementById('btn-sair');
    if (btnSair) {
        btnSair.addEventListener('click', logout);
    }
});
