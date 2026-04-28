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
    localStorage.clear();
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

async function name() {
    const user_id = localStorage.getItem("user_id");
    let url_user = `${API_BASE_URL}/user/${user_id}`;

    let api_name = await fetch(url_user, {
        method: "GET",
        headers: {
               "Content-Type": "application/json"
            }
    });

    if(api_name.ok){
        let response_name = await api_name.json();
        let name = response_name.Nome

        if(!name || name == 'undefined'){
            let name = 'Jogador';
        }

        return name
    }
    
}

document.addEventListener('DOMContentLoaded', async function () {
    let userName = await name()
    console.log(userName)
    const nome_user = document.getElementById("user_name");
    nome_user.innerHTML = `Olá, ${userName}!`;

    const conteiner_game = document.getElementById("game_section");
    const user_id = getUserId();
    let get_games_url = `${API_BASE_URL}/usergame/${user_id}`;

    let api_games = await fetch(get_games_url, {
        method: "GET",
        headers: {
               "Content-Type": "application/json"
            }
    });

    if(api_games.ok){
        let games_response = await api_games.json();
        console.log(games_response)
        if(games_response.length > 0) {
        conteiner_game.innerHTML = ""

        const game_array = games_response.map(game => 
            `
            <div class="game-card">
                <div class="game-cover" style="background-image: url('${game.image}')"></div>
                <div class="game-info">
                    <h3>${game.name}</h3>
                    <p class="game-release-date">Lançado em: <span class=game-value>${game.release_date}</span></p>
                    <p class="game-meta-score">Meta Score: <span class=game-value>${game.meta_score}</span></p>
                    <p class="game-meta-score">Sua Avaliação: <span class=game-value>${game.user_rate}/5</span></p>
                    <p class="game-genre">${game.description}</p>
                </div>
            </div>
        `);

        conteiner_game.innerHTML = game_array.join('');
        
        const destaque = document.getElementById("week-main");
        const indiceAleatorio = Math.floor(Math.random() * games_response.length);
        const jogoSorteado = games_response[indiceAleatorio];
        destaque.innerHTML = `
            <div class="featured-text">
                <h1 class="cinzel-title">${jogoSorteado.name}</h1>
                <span class="game-genre">${jogoSorteado.description}</span>
                <p>Meta Score: ${jogoSorteado.meta_score}</p>
                <p>Sua Avaliação: ${jogoSorteado.user_rate}/5</p>
            </div>
            <div class="featured-image-container">
                <img class="game-cover" src="${jogoSorteado.image}" style="border-radius: 15px;">
            </div>`;
        } else {
            let msg = document.getElementById("colection-msg")
            msg.innerHTML = `<h2 class="cinzel-title" id="colection-msg">Sua Coleção está vazia</h2>
        </div>`
        }
    } else if(!api_games.ok){
        let msg = document.getElementById("colection-msg")
            msg.innerHTML = `<h2 class="cinzel-title" id="colection-msg">Erro ao retornar coleção</h2>
        </div>`
    }
});
