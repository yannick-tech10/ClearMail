alert("SCRIPT LOADED");
console.log("SCRIPT LOADED");
async function fixEmail() {

    const button = document.getElementById("fixButton");
    const output = document.getElementById("output");

    button.disabled = true;
    button.textContent = "✨ Rewriting...";

    try {

        const response = await fetch("/rewrite", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: document.getElementById("emailInput").value,
                tone: document.getElementById("tone").value
            })
        });

        const data = await response.json();

        output.value = data.result;

    } catch (error) {

        console.error(error);
        output.value = "Something went wrong. Please try again.";

    }

    button.disabled = false;
    button.textContent = "✨ Fix Email";
}

function copyOutput() {
    const output = document.getElementById("output");

    if (!output.value) return;

    navigator.clipboard.writeText(output.value);

    const button = document.getElementById("copyButton");
    button.textContent = "Copied ✔";

    setTimeout(() => {
        button.textContent = "📋 Copy Email";
    }, 1500);
}