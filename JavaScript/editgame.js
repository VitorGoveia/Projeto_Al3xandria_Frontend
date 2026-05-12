const URL_BASE = 'http://127.0.0.1:5001';

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('nome').value = localStorage.getItem('name') || '';
    document.getElementById('description').value = localStorage.getItem('description') || '';
    document.getElementById('website').value = localStorage.getItem('website') || '';
});

function voltar() {
    window.location.href = '../VIEW/gamedetail.html';
}

async function salvarEdicao() {
    const rawg_id = localStorage.getItem('rawg_id');
    const description = document.getElementById('description').value.trim();
    const website = document.getElementById('website').value.trim();

    const body = {
        description,
        website
    };

    try {
        const response = await fetch(`${URL_BASE}/game/${rawg_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.erro || 'Erro ao atualizar o jogo.');
            return;
        }

        // Atualiza localStorage
        localStorage.setItem('description', data.jogo.description);
        localStorage.setItem('website', data.jogo.website);

        alert('Jogo atualizado com sucesso!');

        window.location.href = '../VIEW/gamedetail.html';
    } catch (error) {
        console.error(error);
        alert('Erro ao conectar com o servidor.');
    }
}
