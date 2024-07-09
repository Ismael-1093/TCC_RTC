document.getElementById('empresaForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o envio padrão do formulário

    const cnpj = document.getElementById('cnpj').value.trim();
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const fundacao = document.getElementById('fundacao').value;
    const site = document.getElementById('site').value.trim();
    const cep = document.getElementById('cep').value.trim();

    const empresa = {
        cd_cnpj: cnpj,
        nm_empresa: nome,
        email: email,
        password: senha,
        telefone: telefone,
        dt_fundacao: fundacao,
        ds_site: site,
        CEP: cep
    };

    fetch('/api/registerEmpresa', { 
        method: 'POST',
        body: JSON.stringify(empresa),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => {
        const successMessage = document.getElementById('success');
        const errorMessage = document.getElementById('error');

        if (data.status === 'error') {
            successMessage.style.display = 'none';
            errorMessage.style.display = 'block';
            errorMessage.innerText = data.error;
            setTimeout(function() {
                errorMessage.style.display = 'none';
            }, 3000); 
        } else {
            errorMessage.style.display = 'none';
            successMessage.style.display = 'block';
            successMessage.innerText = data.success;

            // Alterar o botão de registro para redirecionar para a tela de login
            const button = document.getElementById("registerButton");
            button.innerText = "Ir para o Login";
            button.onclick = () => {
                window.location.href = "/loginE"; // Altere para o caminho correto da tela de login
            };

        }
    })
    .catch(error => {
        console.error('Error:', error);
        const errorMessage = document.getElementById('error');
        errorMessage.style.display = 'block';
        errorMessage.innerText = 'Erro ao enviar requisição. Tente novamente.';
        setTimeout(function() {
            errorMessage.style.display = 'none';
        }, 3000); 
    });
});
