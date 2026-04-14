const API_BASE_URL = 'http://127.0.0.1:5001';


function getToken() {
    return localStorage.getItem('token');
}

function setToken(token) {
    localStorage.setItem('token', token);
}

function getUserId() {
    return localStorage.getItem('user_id');
}

function setUserId(userId) {
    localStorage.setItem('user_id', userId);
}


function setLoading(isLoading) {
    const btn = document.getElementById('btn-entrar');
    if (!btn) return;

    if (isLoading) {
        btn.disabled = true;
        btn.textContent = 'Entrando...';
    } else {
        btn.disabled = false;
        btn.textContent = 'Entrar';
    }
}

function exibirErro(mensagem) {
    let erroEl = document.getElementById('login-erro');

    if (!erroEl) {
        erroEl = document.createElement('p');
        erroEl.id = 'login-erro';
        erroEl.style.cssText = 'color: #e74c3c; font-size: 0.875rem; margin-top: 8px; text-align: center;';
        const form = document.getElementById('form-login');
        if (form) form.prepend(erroEl);
    }

    erroEl.textContent = mensagem;
    erroEl.style.display = 'block';
}

function limparErro() {
    const erroEl = document.getElementById('login-erro');
    if (erroEl) erroEl.style.display = 'none';
}


async function realizarLogin() {
    limparErro();

    const email = document.getElementById('login-email').value.trim();
    const senha = document.getElementById('login-senha').value.trim();


    if (!email || !senha) {
        exibirErro('Por favor, preencha o e-mail e a senha.');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        exibirErro('Informe um e-mail válido.');
        return;
    }

    setLoading(true);

    const url = `${API_BASE_URL}/login`;
    const body = { email, password: senha };

    try {
        const resposta = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            setToken(dados.access_token);
            setUserId(dados.user_id);

            console.log('Login realizado com sucesso. Redirecionando...');

            window.location.href = 'home.html';
        } else {
            const mensagemErro = dados.erro || dados.message || 'E-mail ou senha incorretos.';
            console.error('Erro no login:', dados);
            exibirErro(mensagemErro);
        }

    } catch (err) {
        console.error('Falha na conexão:', err);
        exibirErro('Não foi possível conectar ao servidor. Tente novamente.');
    } finally {
        setLoading(false);
    }
}



document.addEventListener('DOMContentLoaded', function () {


    if (getToken() && getUserId()) {
        window.location.href = 'home.html';
        return;
    }

    const form = document.getElementById('form-login');
    const btnEntrar = document.getElementById('btn-entrar');
    const btnCriarConta = document.getElementById('btn-criar-conta');


    if (btnEntrar) {
        btnEntrar.addEventListener('click', realizarLogin);
    }

    if (form) {
        form.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                realizarLogin();
            }
        });
    }

    if (btnCriarConta) {
        btnCriarConta.addEventListener('click', function () {
            window.location.href = 'cadastro.html';
        });
    }
});
