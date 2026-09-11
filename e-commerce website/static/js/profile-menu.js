const profileMenu = document.querySelector('.profile-menu');
const profileTrigger = document.querySelector('.profile-trigger');
const profileDropdown = document.querySelector('#profile-dropdown');

function closeProfileMenu() {
  profileDropdown.hidden = true;
  profileTrigger.setAttribute('aria-expanded', 'false');
}

profileTrigger.addEventListener('click', () => {
  const isOpen = !profileDropdown.hidden;
  profileDropdown.hidden = isOpen;
  profileTrigger.setAttribute('aria-expanded', String(!isOpen));
});

document.addEventListener('click', (event) => {
  if (!profileMenu.contains(event.target)) {
    closeProfileMenu();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeProfileMenu();
    profileTrigger.focus();
  }
});
