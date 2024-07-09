document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");
    const errorDiv = document.getElementById("error");
    const successDiv = document.getElementById("success");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const cnpj = document.getElementById("cnpj").value;
        const password = document.getElementById("password").value;

        const login = {
            cnpj,
            password
        };

        try {
            const response = await fetch('/api/loginE', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(login)
            });

            const data = await response.json();

            if (response.ok) {
                // Login bem-sucedido
                successDiv.style.display = "block";
                successDiv.innerText = data.success;

                // Alterar o botão para redirecionar para a página principal
                const button = document.getElementById("loginButton");
                button.innerText = "Ir para a Página Principal";
                button.onclick = () => {
                    window.location.href = "/index.ejs"; // Altere para o caminho correto da página principal
                };

            } else {
                // Exibir mensagem de erro
                errorDiv.style.display = "block";
                errorDiv.innerText = data.error;
            }

        } catch (error) {
            console.error('Erro no login:', error);
            errorDiv.style.display = "block";
            errorDiv.innerText = "Erro no servidor";
        }
    });
});
