async function fixEmail() {

    const email = document.getElementById("emailInput").value;

    if (!email.trim()) {
        alert("Please enter an email first.");
        return;
    }

    const button = document.querySelector("button");

    button.disabled = true;
    button.textContent = "Rewriting...";

    try {

        const response = await fetch("/rewrite", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                tone: document.getElementById("tone").value
            })
        });

        const data = await response.json();

        document.getElementById("output").value = data.result;

    } catch (error) {

        console.error(error);

        document.getElementById("output").value =
            "Error: something went wrong";

    }

    button.disabled = false;
    button.textContent = "Fix My Email";
}