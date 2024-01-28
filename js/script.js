/**
 * Represents the form element used for QR code generation.
 * @type {HTMLFormElement}
 */
const form = document.getElementById('generate-form');

/**
 * Represents the HTML element that will display the QR code.
 * @type {HTMLElement}
 */
const qr = document.getElementById('qrcode');

/**
 * Event handler function for form submission.
 * Prevents the default form submission behavior, validates inputs, clears the UI, and generates a QR code.
 * @param {Event} e - The form submission event.
 */
const onGenerateSubmit = (e) => {
    e.preventDefault();

    try {
        // Clears the UI
        clearUI();

        // Gets URL, size and color values
        const url = document.getElementById('url').value.trim();
        const size = document.getElementById('size').value;
        const foregroundColor = document.getElementById('foregroundColor').value;
        const backgroundColor = document.getElementById('backgroundColor').value;

        // Input validation
        if (!isValidURL(url)) {
            alert('Please enter a valid URL');
            return;
        }

        if (!isValidSize(size)) {
            alert('Please enter a valid numeric size within the range of 100 to 1000');
            return;
        }

        showSpinner();

        setTimeout(() => {
            hideSpinner();
            generateQRCode(url, size, foregroundColor, backgroundColor);

            setTimeout(() => {
                const saveUrl = qr.querySelector('img').src;
                createSaveBtn(saveUrl);
            }, 50);

        }, 1000);

    } catch (error) {
        console.error('Error during form submission:', error);
        alert('An unexpected error occurred. Please try again.');
    }
};

/**
 * Validates if the given string is a valid URL.
 * @param {string} url - The URL to be validated.
 * @returns {boolean} - True if the URL is valid, false otherwise.
 */
const isValidURL = (url) => {
    try {
        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
        return urlRegex.test(url);
    } catch (error) {
        console.error('Error during URL validation:', error);
        return false;
    }
};

/**
 * Validates if the given value is a valid numeric size within the specified range.
 * @param {string} size - The size value to be validated.
 * @returns {boolean} - True if the size is valid, false otherwise.
 */
const isValidSize = (size) => {
    try {
        const numericSize = Number(size);
        return !isNaN(numericSize) && numericSize >= 100 && numericSize <= 1000;
    } catch (error) {
        console.error('Error during size validation:', error);
        return false;
    }
};

/**
 * Generates a QR code with customizable colors and displays it in the designated HTML element.
 * @param {string} url - The URL to be encoded in the QR code.
 * @param {number} size - The size (width and height) of the QR code.
 * @param {string} foregroundColor - The color of the QR code elements.
 * @param {string} backgroundColor - The color of the QR code background.
 */
const generateQRCode = (url, size, foregroundColor, backgroundColor) => {
    try {
        const qrcode = new QRCode('qrcode', {
            text: url,
            width: size,
            height: size,
            colorDark: foregroundColor,
            colorLight: backgroundColor,
        });
    } catch (error) {
        console.error('Error during QR code generation:', error);
        alert('An error occurred while generating the QR code. Please try again.');
    }
};

/**
 * Displays the spinner element to indicate a loading state.
 */
const showSpinner = () => {
    try {
        document.getElementById('spinner').style.display = 'block';
    } catch (error) {
        console.error('Error while showing spinner:', error);
    }
};

/**
 * Hides the spinner element to indicate the end of the loading state.
 */
const hideSpinner = () => {
    try {
        document.getElementById('spinner').style.display = 'none';
    } catch (error) {
        console.error('Error while hiding spinner:', error);
    }
};

/**
 * Clears the QR code and removes the save button from the UI.
 */
const clearUI = () => {
    try {
        qr.innerHTML = '';
        const svBtn = document.getElementById('save-link');
        if (svBtn) {
            svBtn.remove();
        }
    } catch (error) {
        console.error('Error while clearing UI:', error);
    }
};

/**
 * Creates a save button with a link to download the generated QR code.
 * @param {string} saveURL - The URL to be used as a download link.
 */
const createSaveBtn = (saveURL) => {
    try {
        const link = document.createElement('a');
        link.id = 'save-link';
        link.className = 'bg-red-500 hover:bg-red-700 text-white font-bold py-2 rounded w-1/3 m-auto my-5';
        link.href = saveURL;
        link.download = 'qrcode';
        link.innerHTML = 'Save QR Code';
        document.getElementById('generated').appendChild(link);
    } catch (error) {
        console.error('Error while creating save button:', error);
    }
};

/**
 * Function to update the color preview.
 * @param {string} color - The color code to update the preview.
 * @param {string} previewId - The ID of the preview element.
 */
const updateColorPreview = (color, previewId) => {
    try {
        const previewElement = document.getElementById(previewId);
        previewElement.style.backgroundColor = color;
    } catch (error) {
        console.error('Error while updating color preview:', error);
    }
};

// Event listener for color change on the preview
document.getElementById('foregroundColor').addEventListener('input', (e) => {
    updateColorPreview(e.target.value, 'foregroundColorPreview');
});

document.getElementById('backgroundColor').addEventListener('input', (e) => {
    updateColorPreview(e.target.value, 'backgroundColorPreview');
});


// Hides the spinner initially.
hideSpinner();

// Adds a form submission listener to trigger the QR code generation process.
form.addEventListener('submit', onGenerateSubmit);
