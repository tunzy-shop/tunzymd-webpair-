// public/script.js - TUNZYMD Web Pair Frontend
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const generateBtn = document.getElementById('generateBtn');
    const phoneInput = document.getElementById('phoneNumber');
    const resultsSection = document.getElementById('resultsSection');
    const statusMessage = document.getElementById('statusMessage');
    const successBox = document.getElementById('successBox');
    const errorBox = document.getElementById('errorBox');
    const errorMessage = document.getElementById('errorMessage');

    // Generate button click handler
    generateBtn.addEventListener('click', handlePairingRequest);

    // Enter key support
    phoneInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handlePairingRequest();
        }
    });

    // Input validation
    phoneInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        if (this.value.length > 15) {
            this.value = this.value.substring(0, 15);
        }
    });

    // Main pairing function
    async function handlePairingRequest() {
        const phoneNumber = phoneInput.value.trim();
        
        // Validation
        if (!validatePhoneNumber(phoneNumber)) {
            showError('Please enter a valid phone number (10-15 digits, with country code)');
            phoneInput.focus();
            return;
        }

        // Show processing state
        startProcessing(phoneNumber);
    }

    // Validate phone number
    function validatePhoneNumber(number) {
        if (!number) return false;
        if (number.length < 10 || number.length > 15) return false;
        if (!/^\d+$/.test(number)) return false;
        return true;
    }

    // Show processing state
    function startProcessing(number) {
        // Disable inputs
        generateBtn.disabled = true;
        phoneInput.disabled = true;
        
        // Update button text
        generateBtn.innerHTML = `
            <span class="btn-icon"><i class="fas fa-spinner fa-spin"></i></span>
            <span class="btn-text">Processing...</span>
        `;
        
        // Show results section
        resultsSection.classList.remove('hidden');
        successBox.classList.add('hidden');
        errorBox.classList.add('hidden');
        
        // Update status message
        statusMessage.textContent = `Creating session file for +${number}...`;
        
        // Send API request
        sendPairingRequest(number);
    }

    // Send request to backend
    async function sendPairingRequest(number) {
        try {
            statusMessage.textContent = 'Uploading to cloud storage...';
            
            const response = await fetch('/api/pair', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ number: number })
            });

            const data = await response.json();

            if (data.success) {
                showSuccess(data);
            } else {
                showError(data.error || 'Failed to create session file');
            }
        } catch (error) {
            console.error('Request failed:', error);
            showError('Network error. Please check your connection and try again.');
        }
    }

    // Show success state
    function showSuccess(data) {
        statusMessage.textContent = 'File created successfully!';
        
        // Wait a moment for smooth transition
        setTimeout(() => {
            successBox.classList.remove('hidden');
            errorBox.classList.add('hidden');
            
            // Reset button
            resetButton();
            
            // Clear input
            phoneInput.value = '';
            phoneInput.disabled = false;
            
            // Show alert
            setTimeout(() => {
                alert(`✅ Session file created!\n\nCheck your WhatsApp for the download link.\n\nRemember to watch the tutorial video!`);
            }, 500);
            
            // Log success for debugging
            console.log('Pairing successful:', {
                sessionId: data.sessionId,
                pairingCode: data.pairingCode
            });
        }, 1000);
    }

    // Show error state
    function showError(message) {
        statusMessage.textContent = 'Error occurred';
        
        setTimeout(() => {
            errorBox.classList.remove('hidden');
            successBox.classList.add('hidden');
            errorMessage.textContent = message;
            
            // Reset button
            resetButton();
            phoneInput.disabled = false;
            phoneInput.focus();
        }, 500);
    }

    // Reset button state
    function resetButton() {
        generateBtn.disabled = false;
        generateBtn.innerHTML = `
            <span class="btn-icon"><i class="fas fa-bolt"></i></span>
            <span class="btn-text">Generate Creds File</span>
        `;
    }

    // Retry function
    window.retryProcess = function() {
        errorBox.classList.add('hidden');
        phoneInput.focus();
    };

    // Auto-focus on input
    phoneInput.focus();
});
