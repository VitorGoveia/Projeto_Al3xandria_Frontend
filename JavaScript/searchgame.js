const URL_BASE = 'http://127.0.0.1:5001'


document.addEventListener('DOMContentLoaded', async () =>{
    let game_search = localStorage.getItem("typed_game");
    
    if(game_search && game_search.trim() !== ""){
        let url = `${URL_BASE}/slug_game/${game_search}`
    let api = await fetch(url, {
        method: 'GET'
    })

    if(api.ok){
        let response = await api.json()
        const container = document.getElementById('game-results');
        container.innerHTML = "";

        const htmlDosJogos = response.map((jogo, index) => {
        let slug_name = jogo.slug_name;
        return `
        <div class="game-card" id="card-${index}">
            <button class="card-button" onclick="viewDetails('${slug_name}')">
                <img src="${jogo.capa}" alt="Capa de ${jogo.name}" class="game-image">
                <h3 class="game-title">${jogo.name}</h3>
            </button>
        </div>
        `;
        
    }).join(''); // O .join('') junta todos os blocos em um grande texto HTML

    // Insere os blocos criados dentro da div no HTML
    container.innerHTML = htmlDosJogos;
        
    }
    }



});

async function performSearch() {
    const typed_game = document.getElementById("gameSearch").value;
    localStorage.setItem("typed_game", typed_game)
    const container = document.getElementById('game-results');
    container.innerHTML = "";

    let url = `${URL_BASE}/slug_game/${typed_game}`
    let api = await fetch(url, {
        method: 'GET'
    })

    if(api.ok){
        let response = await api.json()
        

        const htmlDosJogos = response.map((jogo, index) => {
        let slug_name = jogo.slug_name;
        return `
        <button class="card-button" onclick="viewDetails('${slug_name}')">
            <div class="game-card" id="card-${index}">
                <img src="${jogo.capa}" alt="Capa de ${jogo.name}" class="game-image">
                <h3 class="game-title">${jogo.name}</h3>     
            </div>
        </button>
        `;
        
    }).join(''); // O .join('') junta todos os blocos em um grande texto HTML

    // Insere os blocos criados dentro da div no HTML
    container.innerHTML = htmlDosJogos;
        
    }


    
}


async function viewDetails(slug_name){
    let url_realname = `${URL_BASE}/game/${slug_name}`;

    let api_realname = await fetch(url_realname, {
        method: 'GET'
    });

    if(api_realname.ok){
        let response_realName = await api_realname.json()
        let description = response_realName.description || 'Unavailable';
        let img = response_realName.imagem || 'Unavailable';
        let meta_score = response_realName.meta_score || 0;
        let name = response_realName.nome || 'Unavailable';
        let rawg_id = response_realName.rawg_id;
        let website = response_realName.website || 'Unavailable';
        let released_date = response_realName.release_date || 'Unavailable';
        let url_meta_score = response_realName.url_meta_score || 'Unavailable';
        let slug_name = response_realName.slug_name;

        localStorage.setItem("slug_name", slug_name);
        localStorage.setItem('description', description);
        localStorage.setItem('img', img);
        localStorage.setItem('meta_score', meta_score);
        localStorage.setItem('name', name);
        localStorage.setItem('website', website);
        localStorage.setItem('released_date', released_date);
        localStorage.setItem('rawg_id', rawg_id);
        localStorage.setItem('url_meta_score', url_meta_score);
        console.log(response_realName);
        window.location.href = "../VIEW/gamedetail.html";
    } else {
        alert("Something wrong! Try again")
    }

}

function come_back(){
    window.location.href = "../VIEW/home.html"
}