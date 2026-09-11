const mobileNumber = document.querySelector('#mobile-number');
const termsCheck = document.querySelector('#terms-check');
const continueButton = document.querySelector('#continue-button');
const loginForm = document.querySelector('#login-form');
const customerName = document.querySelector('#customer-name');

if (loginForm) {
  function updateContinueButton() {
    const isReady = customerName.value.trim().length > 1 && mobileNumber.value.length === 10 && termsCheck.checked;
    continueButton.disabled = !isReady;
    continueButton.classList.toggle('is-ready', isReady);
  }

  mobileNumber.addEventListener('input', () => {
    mobileNumber.value = mobileNumber.value.replace(/\D/g, '').slice(0, 10);
    updateContinueButton();
  });
  termsCheck.addEventListener('change', updateContinueButton);
  customerName.addEventListener('input', updateContinueButton);
}

const otpInputs = document.querySelectorAll('.otp-digit');
otpInputs.forEach((input, index) => {
  input.addEventListener('input', () => {
    input.value = input.value.replace(/\D/g, '').slice(0, 1);
    if (input.value && otpInputs[index + 1]) otpInputs[index + 1].focus();
  });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Backspace' && !input.value && otpInputs[index - 1]) otpInputs[index - 1].focus();
  });
});
