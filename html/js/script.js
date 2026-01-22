const loginForm = document.querySelector("#login-form");
const signupForm = document.querySelector("#signup-form");
const changeBtn = document.querySelector("#changePasswordBtn");
const passwordBox =document.querySelector("#passwordBox");
const closeBtn = document.querySelector("#closepasswordbox");
const settings = document.querySelector("#settings");

window.showSignup = function () {
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
    return false;
};
function initAuthForms() {
    
    
    if (!loginForm || !signupForm) return;


    // Show login form
    window.showLogin = function() {
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        return false;
    };

    // Handle form submissions
    const forms = document.querySelectorAll('.auth-form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simulate authentication
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        });
    });
}


// const changePasswordBtn = document.querySelector("#changePasswordBtn");

// changePasswordBtn.addEventListener("click", () => {
//     passwordBox.classList.remove('hidden');
//     settings.classList.add('hidden');
// });

// closeBtn.addEventListener("click", () => {
//     passwordBox.style.display = "none";
//     settings.classList.remove('hidden');
// });




