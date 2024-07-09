form.addEventListener("submit",() =>{
    const login  = {
        email : email.value,
        password: password.value
    }
    fetch("/api/login", {
        method:"POST",
        body: JSON.stringify(login),
        headers : {
            "Content-Type":"application/json"
        }
    }).then(res => res.json())
    .then(data => {
        if(data.status == "error"){
            success.style.display = "none"
            error.style.display = "block"
            error.innerText = data.error
        } else {
            error.style.display = "none"
            success.style.display = "block"
            success.innerText = data.success
        }
    })
})

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");
    const errorDiv = document.getElementById("error");
    const successDiv = document.getElementById("success");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Login bem-sucedido
                successDiv.style.display = "block";
                successDiv.innerText = data.success;

                // Alterar o botão para redirecionar para a página principal
                const button = document.querySelector("button.btn-primary");
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
