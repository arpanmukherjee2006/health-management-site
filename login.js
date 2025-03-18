document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const forgotPasswordLink = document.getElementById('forgotPassword');
    const contactSupportLink = document.getElementById('contactSupport');
    
    // Handle form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        // Get the selected user type if it exists
        const userTypeElement = document.querySelector('input[name="userType"]:checked');
        const userType = userTypeElement ? userTypeElement.value : null;
        
        // Validate input
        if (!username || !password) {
            showError('Please enter both username and password');
            return;
        }
        
        // Clear any previous error messages
        clearError();
        
        // Show loading state
        const loginBtn = document.querySelector('.login-btn');
        const originalBtnText = loginBtn.textContent;
        loginBtn.textContent = 'Logging in...';
        loginBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Authentication logic would go here
            console.log('Login attempt:', {
                username,
                userType
            });
            
            // Simply redirect to index.html regardless of user type or input
            window.location.href = 'index.html';
            
            // Reset button state (though not needed as we're redirecting)
            loginBtn.textContent = originalBtnText;
            loginBtn.disabled = false;
        }, 1500);
    });
    
    // Forgot password handler
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        const username = usernameInput.value.trim();
        
        if (!username) {
            showError('Please enter your username first');
            usernameInput.focus();
            return;
        }
        
        alert(`Password reset instructions will be sent to the email associated with username: ${username}`);
    });
    
    // Contact support handler
    contactSupportLink.addEventListener('click', function(e) {
        e.preventDefault();
        alert('For support, please contact: support@hdims.gov.in or call: +91-1234567890');
    });
    
    // Function to show error message
    function showError(message) {
        clearError();
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error';
        errorElement.textContent = message;
        
        loginForm.insertBefore(errorElement, loginForm.firstChild);
    }
    
    // Function to clear error messages
    function clearError() {
        const errorElement = document.querySelector('.error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    // Add focus effect to input fields
    const inputFields = document.querySelectorAll('.input-group input');
    inputFields.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.borderColor = '#ff9500';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.borderColor = '#eee';
        });
    });
});