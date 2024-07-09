document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");
    const errorDiv = document.getElementById("error");
    const successDiv = document.getElementById("success");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            errorDiv.style.display = "block";
            errorDiv.innerText = "As senhas não coincidem.";
            setTimeout(() => {
                errorDiv.style.display = "none";
            }, 3000);
            return;
        }

        const register = {
            name,
            email,
            password,
            confirmPassword
        };

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(register)
            });

            const data = await response.json();

            if (response.ok) {
                // Registro bem-sucedido
                successDiv.style.display = "block";
                successDiv.innerText = data.success;

                // Alterar o botão de registro para redirecionar para a tela de login
                const button = document.getElementById("registerButton");
                button.innerText = "Ir para o Login";
                button.onclick = () => {
                    window.location.href = "/login"; // Altere para o caminho correto da tela de login
                };

            } else {
                // Exibir mensagem de erro
                errorDiv.style.display = "block";
                errorDiv.innerText = data.error;
            }

        } catch (error) {
            console.error('Erro no registro:', error);
            errorDiv.style.display = "block";
            errorDiv.innerText = "Erro no servidor";
        }
    });
});
