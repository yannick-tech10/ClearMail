let currentMode = "rewrite";

function switchMode(mode) {
    currentMode = mode;

    const tabRewrite = document.getElementById("tabRewrite");
    const tabReply = document.getElementById("tabReply");
    const replyNotesContainer = document.getElementById("replyNotesContainer");
    const emailInput = document.getElementById("emailInput");
    const fixButton = document.getElementById("fixButton");

    if (mode === "reply") {
        tabRewrite.classList.remove("active");
        tabReply.classList.add("active");
        replyNotesContainer.style.display = "block";
        emailInput.placeholder = "Paste the email you received here...";
        fixButton.innerHTML = "💬 Generate Reply";
    } else {
        tabReply.classList.remove("active");
        tabRewrite.classList.add("active");
        replyNotesContainer.style.display = "none";
        emailInput.placeholder = "Paste your email here...";
        fixButton.innerHTML = "✨ Fix Email";
    }
}

async function processEmail() {
    const button = document.getElementById("fixButton");
    const output = document.getElementById("output");
    const emailText = document.getElementById("emailInput").value.trim();
    const replyNotesText = document.getElementById("replyNotes") ? document.getElementById("replyNotes").value.trim() : "";
    const selectedTone = document.getElementById("tone").value;

    if (!emailText) {
        output.value = "Please paste an email first!";
        return;
    }

    button.disabled = true;
    button.textContent = currentMode === "reply" ? "💬 Generating Reply..." : "✨ Rewriting...";

    try {
        const response = await fetch("/rewrite", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: emailText,
                tone: selectedTone,
                mode: currentMode,
                replyNotes: replyNotesText
            })
        });

        const data = await response.json();

        if (data.result) {
            output.value = data.result;
        } else {
            output.value = "Something went wrong. Please try again.";
        }

    } catch (error) {
        console.error(error);
        output.value = "Something went wrong. Please check your connection and try again.";
    } finally {
        button.disabled = false;
        button.innerHTML = currentMode === "reply" ? "💬 Generate Reply" : "✨ Fix Email";
    }
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
