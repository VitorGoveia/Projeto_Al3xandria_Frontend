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
// Navegação para detalhes do jogo
// =============================================

function irParaDetalhes(game) {
    localStorage.setItem("name", game.name);
    localStorage.setItem("description", game.description);
    localStorage.setItem("img", game.image);
    localStorage.setItem("meta_score", game.meta_score);
    localStorage.setItem("released_date", game.release_date);
    localStorage.setItem("website", game.website || "");
    localStorage.setItem("rawg_id", game.rawg_id || "");
    localStorage.setItem("slug_name", game.slug_name || "");
    localStorage.setItem("url_meta_score", game.url_meta_score || "");

    window.location.href = "../VIEW/gamedetail.html";
}

// =============================================
// Excluir Jogo da Coleção
// =============================================

async function deletarJogo(game_id) {
    if (!confirm("Tem certeza que deseja excluir este jogo da sua coleção?")) {
        return; 
    }

    const user_id = getUserId();
    
    // Verifique se a sua API usa exatamente esta URL para deletar
    let url_delete = `${API_BASE_URL}/usergame/${user_id}/${game_id}`;

    try {
        let response = await fetch(url_delete, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            alert("Jogo excluído com sucesso!");
            
            // ATUALIZAÇÃO: Em vez de tentar redirecionar, forçamos a página atual a recarregar
            window.location.href = "home.html"
            
        } else {
            // Se cair aqui, a API recusou a exclusão (ex: ID errado ou rota incorreta)
            alert("Erro na exclusão. A API retornou status: " + response.status);
            console.error("Erro da API:", await response.text());
        }
        
    } catch (error) {
        console.error("Erro na requisição de exclusão:", error);
        alert("Erro de conexão ao tentar excluir. Verifique se o servidor Flask/Python está rodando.");
    }
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

    if (api_name.ok) {
        let response_name = await api_name.json();
        let name = response_name.Nome;

        if (!name || name == 'undefined') {
            name = 'Jogador';
        }

        return name;
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    let userName = await name();
    const nome_user = document.getElementById("user_name");
    
    if (nome_user) {
        nome_user.innerHTML = `Olá, ${userName}!`;
    }

    const conteiner_game = document.getElementById("game_section");
    const user_id = getUserId();
    let get_games_url = `${API_BASE_URL}/usergame/${user_id}`;

    let api_games = await fetch(get_games_url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (api_games.ok) {
        let games_response = await api_games.json();

        if (games_response.length > 0) {
            if (conteiner_game) conteiner_game.innerHTML = "";

            // Salvamos a lista de jogos globalmente para acessar no clique
            window.jogosCarregados = games_response;

            // Renderizando os cards e adicionando o botão de excluir
            // O event.stopPropagation() impede que clicar em Excluir ative o irParaDetalhes
            const game_array = games_response.map((game, index) =>
                `
                <div class="game-card" onclick="irParaDetalhes(window.jogosCarregados[${index}])" style="cursor: pointer; position: relative;">
                    <div class="game-cover" style="background-image: url('${game.image}')"></div>
                    <div class="game-info">
                        <h3>${game.name}</h3>
                        <p class="game-release-date">Lançado em: <span class="game-value">${game.release_date}</span></p>
                        <p class="game-meta-score">Meta Score: <span class="game-value">${game.meta_score}</span></p>
                        <p class="game-meta-score">Sua Avaliação: <span class="game-value">${game.user_rate}/5</span></p>
                        <p class="game-genre">${game.description}</p>
                        
                        <button onclick="event.stopPropagation(); deletarJogo('${game.id || game.rawg_id}')" 
                                style="margin-top: 10px; background-color: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; z-index: 10;">
                            Excluir Jogo
                        </button>
                    </div>
                </div>
            `);

            if (conteiner_game) conteiner_game.innerHTML = game_array.join('');

            const destaque = document.getElementById("week-main");
            if (destaque) {
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
            }
        } else {
            let msg = document.getElementById("colection-msg");
            if (msg) msg.innerHTML = `<h2 class="cinzel-title" id="colection-msg">Sua Coleção está vazia</h2>`;
        }

    } else {
        let msg = document.getElementById("colection-msg");
        if (msg) msg.innerHTML = `<h2 class="cinzel-title" id="colection-msg">Erro ao retornar coleção</h2>`;
    }
});