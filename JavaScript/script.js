async function postData(){
    const name = document.getElementById("cadastro-nome").value;
    const email = document.getElementById("cadastro-email").value;
    const password = document.getElementById("cadastro-senha").value;
    const phone = document.getElementById("cadastro-celular").value;

    if (!name || !email || !password || !phone) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const url = 'http://127.0.0.1:5001/user';

    console.log(name, email, password, phone)
    let body = {
            "nome": name,
            "email": email,
            "celular": phone,
            "senha": password
        };

    console.log(body)
    let api = await fetch(url,
        {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify(body)

        });
    
    console.log("oi")
    console.log(api)
    
    

    if (api.ok) {
        let data = await api.json();
        console.log(data);
        alert('Cadastro realizado com sucesso!')
        document.getElementById("form-cadastro").reset();
        window.location.href = 'login.html';
    } else {
        let errorApi = await api.json();
        let erro = errorApi.data.erro;
    }

}

async function getDados() {
    const num = document.getElementById("id").value;

    if (!num) {
        alert("Por favor, digite um ID para buscar.");
        return;
    }

    const url = 'http://127.0.0.1:5001/user/' + num;

    try {
        const api = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        
        if (!api.ok) {
            throw new Error(`Erro na API: Usuário não encontrado ou falha no servidor (Status: ${api.status})`);
        }
    
        const usuario = await api.json();
    
        document.getElementById("user-name").value = usuario?.Nome ?? "";
        document.getElementById("user-email").value = usuario?.["E-mail"] ?? "";
        document.getElementById("user-phone").value = usuario?.Celular ?? "";
        console.log("Usuário encontrado:", usuario);

    } catch (error) {
        document.getElementById("user-name").value = "";
        document.getElementById("user-email").value = "";
        document.getElementById("user-phone").value = "";
        
        console.error("Ocorreu uma falha na busca:", error);
        alert("Não foi possível encontrar o usuário. Verifique o ID e tente novamente.");
    }
}