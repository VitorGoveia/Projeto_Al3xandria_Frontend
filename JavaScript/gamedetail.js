const URL_BASE = 'http://127.0.0.1:5001';

const modal = document.getElementById('modal-avaliacao');
const modalDelete = document.getElementById('modal-delete');

function come_back() {
    window.location.href = "../VIEW/searchgames.html";
}

document.addEventListener('DOMContentLoaded', async () => {

    const description = localStorage.getItem("description");
    const name = localStorage.getItem("name");
    const img = localStorage.getItem("img");
    const meta_score = localStorage.getItem("meta_score");
    const rawg_id = localStorage.getItem("rawg_id");
    const released_date = localStorage.getItem('released_date');
    const website = localStorage.getItem('website');

    const user_id = localStorage.getItem("user_id");

    let jogoNaBiblioteca = false;

    // ======================================
    // VERIFICA SE O JOGO ESTÁ NA BIBLIOTECA
    // ======================================

    try {

        const response =
            await fetch(`${URL_BASE}/usergame/${user_id}`);

        const respostaApi =
            await response.json();

        // tenta pegar array direto
        let jogosUsuario = respostaApi;

        // se vier dentro de "games"
        if (respostaApi.games) {
            jogosUsuario = respostaApi.games;
        }

        // se vier dentro de "data"
        if (respostaApi.data) {
            jogosUsuario = respostaApi.data;
        }

        // Compara pelo nome enquanto o backend não retorna rawg_id
        jogoNaBiblioteca = jogosUsuario.some(jogo => {
            return jogo.name.toLowerCase() === name.toLowerCase();
        });

        console.log("Jogo na biblioteca:", jogoNaBiblioteca);

    } catch (error) {

        console.error(
            "Erro ao verificar biblioteca:",
            error
        );

    }

    let name_tratado =
        name.charAt(0).toUpperCase() +
        name.slice(1).toLowerCase();

    let game_container =
        document.getElementById("game-container");

    game_container.innerHTML = `
        <div class="game-card">

            <div class="game-header">
                <img src="${img}" alt="${name_tratado}" class="game-img">
            </div>

            <div class="game-content">

                <h1 class="game-title">
                    ${name_tratado}
                </h1>

                <div class="game-info">

                    <span class="badge score">
                        ⭐ Meta Critic: ${meta_score}
                    </span>

                    <span class="badge date">
                        📅 Lançamento: ${released_date}
                    </span>

                </div>

                <div class="game-description">

                    <h3>Sobre o jogo</h3>

                    <p>${description}</p>

                </div>

                <div class="game-footer">

                    <a href="${website}" target="_blank" class="btn-website">
                        Visitar Site Oficial
                    </a>

                    ${!jogoNaBiblioteca ? `
                        <a href="#" onclick="salvar_jogo()" class="btn-website">
                            Adicionar à Biblioteca
                        </a>
                    ` : ''}

                    <a href="#" onclick="editarJogo()" class="btn-website">
                        Editar Jogo
                    </a>

                    ${jogoNaBiblioteca ? `
                        <a href="#" onclick="abrirModalDelete()" class="btn-delete">
                            Excluir Jogo
                        </a>
                    ` : ''}

                </div>

            </div>

        </div>
    `;
});

// =========================
// SALVAR JOGO
// =========================

async function salvar_jogo() {

    modal.showModal();

}

function fecharModal() {

    modal.close();

}

async function salvarAvaliacao() {

    const nota =
        document.querySelector('input[name="star"]:checked')?.value;

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
        };

        let register_body = {
            "user_data": user_data,
            "game_data": game_data
        };

        console.log(register_body);

        let register_api = await fetch(register_url, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(register_body)

        });

        if (register_api.ok) {

            fecharModal();

            alert(`Jogo adicionado com nota ${nota}!`);

            window.location.href =
                "../VIEW/home.html";

        } else {

            alert("Ops, algo deu errado");

        }

    } else {

        alert("Por favor, selecione uma nota.");

    }
}

// =========================
// EDITAR JOGO
// =========================

function editarJogo() {

    window.location.href = "../VIEW/editgame.html";

}

// =========================
// MODAL DELETE
// =========================

function abrirModalDelete() {

    modalDelete.showModal();

}

function fecharModalDelete() {

    modalDelete.close();

}

// =========================
// EXCLUIR JOGO
// =========================

async function excluirJogo() {

    const userId = localStorage.getItem("user_id");

    const gameId = localStorage.getItem("rawg_id");

    try {

        const response = await fetch(

            `${URL_BASE}/usergame/${userId}/${gameId}`,

            {
                method: "DELETE"
            }

        );

        const data = await response.json();

        if (response.ok) {

            alert("Jogo removido da sua biblioteca!");

            fecharModalDelete();

            window.location.href =
                "../VIEW/home.html";

        } else {

            alert(
                data.erro ||
                "Erro ao remover jogo."
            );

        }

    } catch (error) {

        console.error(error);

        alert("Erro de conexão com a API.");

    }
}