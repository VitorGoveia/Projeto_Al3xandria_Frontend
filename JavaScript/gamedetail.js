const URL_BASE = 'http://127.0.0.1:5001'
const modal = document.getElementById('modal-avaliacao');

function come_back() {
    window.location.href = "../VIEW/searchgames.html";
}

document.addEventListener('DOMContentLoaded', () => {
    const description = localStorage.getItem("description");
    const name = localStorage.getItem("name");
    const img = localStorage.getItem("img");
    const meta_score = localStorage.getItem("meta_score");
    const rawg_id = localStorage.getItem("rawg_id");
    const released_date = localStorage.getItem('released_date');
    const url_meta_score = localStorage.getItem('url_meta_score');
    const website = localStorage.getItem('website');

    let name_tratado = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    let game_container = document.getElementById("game-container");

    game_container.innerHTML = `
        <div class="game-card">
            <div class="game-header">
                <img src="${img}" alt="${name_tratado}" class="game-img">
            </div>
            
            <div class="game-content">
                <h1 class="game-title">${name_tratado}</h1>
                
                <div class="game-info">
                    <span class="badge score">⭐ Meta Critic: ${meta_score}</span>
                    <span class="badge date">📅 Lançamento: ${released_date}</span>
                </div>

                <div class="game-description">
                    <h3>Sobre o jogo</h3>
                    <p>${description}</p>
                </div>

                <div class="game-footer">
                    <a href="${website}" target="_blank" class="btn-website">Visitar Site Oficial</a>
                    <a onclick="salvar_jogo()" class="btn-website">Adicionar à Biblioteca</a>
                    <a onclick="editarJogo()" class="btn-website">Editar Jogo</a>
                </div>
            </div>
        </div>
    `;
});


async function salvar_jogo() {
    modal.showModal();


}



function fecharModal() {
    modal.close(); // Fecha a janelinha
}

async function salvarAvaliacao() {
    const nota = document.querySelector('input[name="star"]:checked')?.value;
    const user_id = localStorage.getItem("user_id");
    const register_url = `${URL_BASE}/usergame`;


    if (nota) {
        console.log("Jogo avaliado com nota:", nota);
        const game_id = localStorage.getItem("rawg_id");
        const game_name = localStorage.getItem("name");
        const game_description = localStorage.getItem("description");
        const game_img = localStorage.getItem("img");
        const game_meta_score = localStorage.getItem("meta_score");
        const game_r_date = localStorage.getItem("released_date");
        const game_typed_game = localStorage.getItem("typed_game");
        const game_url_meta = localStorage.getItem("url_meta_score");
        const game_website = localStorage.getItem("website");

        let user_data = {
            "user_id": user_id,
            "user_rate": nota
        };

        let game_data = {
            "rawg_id": game_id,
            "nome": game_name,
            "imagem": game_img,
            "meta_score": game_meta_score,
            "url_meta_score": game_url_meta,
            "release_date": game_r_date,
            "website": game_website,
            "description": game_description,
            "slug_name": localStorage.getItem("slug_name")

        }

        let reister_body = {
            "user_data": user_data,
            "game_data": game_data
        };
        console.log(reister_body)
        let register_api = await fetch(register_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reister_body)

        });

        if (register_api.ok) {
            let register_response = await register_api;
            console.log(register_response)
            fecharModal();
            alert(`Jogo adicionado com nota ${nota}!`);
        } else {
            alert("Ops, algo deu errado")
        }


    } else {
        alert("Por favor, selecione uma nota.");
    }
}

async function editarJogo() {
    const rawgId = localStorage.getItem("rawg_id");
    const descricaoAtual = localStorage.getItem("description");
    const websiteAtual = localStorage.getItem("website");

    const novaDescricao = prompt("Edite a descrição do jogo:", descricaoAtual);
    if (novaDescricao === null) return;

    const novoWebsite = prompt("Edite o website do jogo:", websiteAtual);
    if (novoWebsite === null) return;

    const body = {
        description: novaDescricao,
        website: novoWebsite
    };

    try {
        const response = await fetch(`${URL_BASE}/game/${rawgId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (response.ok) {
            alert("Jogo atualizado com sucesso!");

            // Atualiza localStorage
            localStorage.setItem("description", data.jogo.description);
            localStorage.setItem("website", data.jogo.website);

            // Recarrega a página para mostrar os dados atualizados
            location.reload();
        } else {
            alert(data.erro || "Erro ao atualizar o jogo.");
        }

    } catch (error) {
        console.error("Erro ao atualizar jogo:", error);
        alert("Erro de conexão com a API.");
    }
}
