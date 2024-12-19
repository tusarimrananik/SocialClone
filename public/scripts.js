// Attach event listener to the form
const facebookForm = document.getElementById('facebookForm');
const gmailForm = document.getElementById('gmailForm');
const result = document.getElementById('result');
const loadingContainer = document.getElementById('loadingContainer');
const errorMessage = document.getElementById('errorMessage');
const errorMessagText = document.getElementById('errorMessagText');
const resultImage = document.getElementById('resultImage');
const facebookFormButton = document.getElementById('facebookFormButton');
const gmailFormButton = document.getElementById('gmailFormButton');

function disableFormSubmit(condition) {
    facebookFormButton.disabled = condition;
    gmailFormButton.disabled = condition;
    document.getElementById('facebookFormInput').disabled = condition;
    document.getElementById('gmailFormInput').disabled = condition;
}

downloadButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = resultImage.src;
    link.download = 'image.png';
    link.click();
    link.remove();
});

facebookForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    result.style.display = "none";
    errorMessagText.textContent = "";
    errorMessage.style.display = "none";
    try {
        loadingContainer.style.display = "block";
        disableFormSubmit(true);
        facebookFormButton.disabled = true;
        const facebookProfileUrl = document.getElementById('facebookFormInput').value;
        const data = { facebookProfileUrl };
        const response = await fetch('/api/facebook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        disableFormSubmit(false);
        loadingContainer.style.display = "none";
        if (response.ok) {
            const imageSource = await response.json();
            resultImage.src = imageSource.imgSrc;
            result.style.display = "flex";
        } else {
            errorMessage.style.display = "block";
            const errorMessages = await response.json()
            errorMessages.error.forEach(e => {
                errorMessagText.textContent += `${e}\n`;
            });
        }
    } catch (error) {
        console.log('Fetch error:', error);
    }
});

gmailForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    result.style.display = "none";
    errorMessagText.textContent = "";
    errorMessage.style.display = "none";
    try {
        loadingContainer.style.display = "block";
        disableFormSubmit(true);
        const gmail = document.getElementById('gmailFormInput').value;
        const data = { gmail };
        const response = await fetch('/api/gmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        disableFormSubmit(false);
        loadingContainer.style.display = "none";
        if (response.ok) {
            const imageSource = await response.json();
            resultImage.src = imageSource.imgSrc;
            result.style.display = "flex";
        } else {
            errorMessage.style.display = "block";
            const errorMessages = await response.json()
            errorMessages.error.forEach(e => {
                errorMessagText.innerHTML = `${e}`;
            });
        }
    } catch (error) {
        console.log('Fetch error:', error);
    }
});

document.getElementById('facebookFormInput').addEventListener('focus', async () => {
    const clipboardText = await pasteFromClipboard();
    document.getElementById('facebookFormInput').value = clipboardText;
})

async function pasteFromClipboard() {
    try {
        if (!navigator.clipboard) {
            console.error("Clipboard API not supported in this browser.");
            return;
        }
        const text = await navigator.clipboard.readText();
        return text;
    } catch (err) {
        console.error("Failed to read from clipboard:", err);
    }
}
