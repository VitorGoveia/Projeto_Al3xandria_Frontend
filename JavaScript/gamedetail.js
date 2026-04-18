const URL_BASE = 'http://127.0.0.1:5001'

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
                </div>
            </div>
        </div>
    `;
});