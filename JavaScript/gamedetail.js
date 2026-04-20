const URL_BASE = 'http://127.0.0.1:5001'
const modal = document.getElementById('modal-avaliacao');

function come_back(){
    window.location.href = "../VIEW/searchgames.html";
}

document.addEventListener('DOMContentLoaded', () =>{
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
                </div>
            </div>
        </div>
    `;
});


async function salvar_jogo(){
    modal.showModal();
     

}



function fecharModal() {
    modal.close(); // Fecha a janelinha
}

function salvarAvaliacao() {
    const nota = document.querySelector('input[name="star"]:checked')?.value;
    
    if (nota) {
        console.log("Jogo avaliado com nota:", nota);
        // Aqui você faria a lógica para salvar no seu banco ou localStorage
        fecharModal();
        alert(`Jogo adicionado com nota ${nota}!`);
    } else {
        alert("Por favor, selecione uma nota.");
    }
}