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
            showError('
