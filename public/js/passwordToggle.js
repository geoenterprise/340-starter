const pswdBtn = document.querySelector('#pswdbtn');
pswdBtn.addEventListener('click', function () {
  const pswdInput = document.querySelector('#account_password');
  const type = pswdInput.getAttribute('type');
  if (type === 'password') {
    pswdInput.setAttribute('type', 'text');
    pswdBtn.innerHTML = 'Hide Password';
  } else {
    pswdInput.setAttribute('type', 'password');
    pswdBtn.innerHTML = 'Show Password';
  }
});
