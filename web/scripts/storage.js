// MITAI Save File Management
const VERSION_KEY = "MITAI_V0.2.x";

/**
 * Decrypt save file data
 * @param {string} encryptedData - Encrypted save file content
 * @returns {string} Decrypted content
 */
function decryptSave(encryptedData) {
    let decrypted = "";
    for (let i = 0; i < encryptedData.length; i++) {
        let charCode = encryptedData.charCodeAt(i) - 10;
        let keyChar = VERSION_KEY.charCodeAt(i % VERSION_KEY.length);
        decrypted += String.fromCharCode(charCode ^ keyChar);
    }
    return decrypted;
}

/**
 * Encrypt save file data
 * @param {object} content - Data object to encrypt
 * @returns {string} Encrypted content
 */
function encryptSave(content) {
    let encrypted = "";
    const strContent = JSON.stringify(content);
    for (let i = 0; i < strContent.length; i++) {
        let keyChar = VERSION_KEY.charCodeAt(i % VERSION_KEY.length);
        let charCode = strContent.charCodeAt(i) ^ keyChar;
        encrypted += String.fromCharCode(charCode + 10);
    }
    return encrypted;
}

/**
 * Download save file
 * @param {object} saveData - Data to save
 * @param {string} filename - Download filename (default: 'progress.mitai_save')
 */
function downloadSaveFile(saveData, filename = 'progress.mitai_save') {
    const encrypted = encryptSave(saveData);
    const blob = new Blob([encrypted], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Read and parse save file
 * @param {File} file - File object from input
 * @param {Function} onSuccess - Callback on successful read (receives parsed data)
 * @param {Function} onError - Callback on error
 */
function loadSaveFile(file, onSuccess, onError) {
    if (!file) {
        if (onError) onError("No file selected");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const rawContent = e.target.result;
            const decryptedContent = decryptSave(rawContent);
            const saveData = JSON.parse(decryptedContent);
            
            if (saveData.project_mitai) {
                if (onSuccess) onSuccess(saveData);
            } else {
                throw new Error("Invalid save file format");
            }
        } catch (err) {
            if (onError) onError(err.message || "Failed to load save file");
        }
    };
    reader.onerror = function() {
        if (onError) onError("Failed to read file");
    };
    reader.readAsText(file);
}

/**
 * Create standard save data object
 * @param {string} character - Character name
 * @returns {object} Save data object
 */
function createSaveData(character) {
    return {
        project_mitai: true,
        character: character,
        version: VERSION_KEY,
        timestamp: Date.now()
    };
}
