let currentMode = 'rewrite'; // Default mode

function switchMode(mode) {
    currentMode = mode;

    const tabRewrite = document.getElementById('tabRewrite');
    const tabReply = document.getElementById('tabReply');
    const emailInput = document.getElementById('emailInput');
    const replyNotesContainer = document.getElementById('replyNotesContainer');
    const fixButton = document.getElementById('fixButton');

    if (mode === 'reply') {
        tabRewrite.classList.remove('active');
        tabReply.classList.add('active');

        emailInput.placeholder = "Paste the email you received here...";
        replyNotesContainer.style.display = 'block';
        fixButton.innerText = "💬 Generate Reply";
    } else {
        tabReply.classList.remove('active');
        tabRewrite.classList.add('active');

        emailInput.placeholder = "Paste your email here...";
        replyNotesContainer.style.display = 'none';
        fixButton.innerText = "✨ Fix Email";
    }
}

// Tone pill handler (updates hidden input & toggles button visual active state)
function selectTone(selectedVal) {
    const toneInput = document.getElementById('tone');
    if (toneInput) {
        toneInput.value = selectedVal;
    }

    const pills = document.querySelectorAll('.tone-pill');
    pills.forEach(pill => {
        if (pill.getAttribute('data-value') === selectedVal) {
            pill.classList.add('active');
        } else {
            pill.classList.remove('active');
        }
    });
}

async function processEmail() {
    const emailInput = document.getElementById("emailInput").value.trim();
    const replyNotes = document.getElementById("replyNotes") ? document.getElementById("replyNotes").value.trim() : "";
    const tone = document.getElementById("tone").value;
    const output = document.getElementById("output");
    const fixButton = document.getElementById("fixButton");

    if (!emailInput) {
        alert(currentMode === 'reply' ? "Please paste the email you received!" : "Please enter an email to fix!");
        return;
    }

    const originalButtonText = fixButton.innerText;
    fixButton.innerText = "✨ Generating...";
    fixButton.disabled = true;

    try {
        const response = await fetch("/rewrite", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: emailInput,
                tone: tone,
                mode: currentMode,
                replyNotes: replyNotes
            })
        });

        const data = await response.json();
        output.value = data.result;

    } catch (error) {
        console.error("Error:", error);
        output.value = "Something went wrong. Please try again.";
    } finally {
        fixButton.innerText = originalButtonText;
        fixButton.disabled = false;
    }
}

// Helper to keep legacy function calls working if triggered from HTML
function fixEmail() {
    processEmail();
}

function copyOutput() {
    const output = document.getElementById("output");
    if (!output.value) return;

    output.select();
    document.execCommand("copy");
    alert("Email copied to clipboard!");
}