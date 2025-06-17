// auth.js

// Inicializa dados padrão (exemplo: chama do util.js)
initializeData();

// Função para realizar login
function login() {
  const username = document.getElementById('loginUser').value.trim();
  const password = document.getElementById('loginPass').value.trim();

  if (!username || !password) {
    document.getElementById('msgLogin').innerText = 'Preencha todos os campos.';
    return;
  }

  const usuarios = getStorageItem('usuarios') || [];
  const usuario = usuarios.find(us => us.user === username);

  if (!usuario) {
    document.getElementById('msgLogin').innerText = 'Usuário não encontrado.';
    return;
  }
  if (usuario.pass !== password) {
    document.getElementById('msgLogin').innerText = 'Senha incorreta.';
    return;
  }

  setStorageItem('logado', username);
  location.href = 'menu.html';
}

// Função para registrar um novo usuário
function registrar() {
  const username = document.getElementById('regUser').value.trim();
  const password = document.getElementById('regPass').value.trim();

  if (!username || !password) {
    document.getElementById('msgRegistro').innerText = 'Preencha todos os campos.';
    return;
  }

  const usuarios = getStorageItem('usuarios') || [];

  if (usuarios.find(us => us.user === username)) {
    document.getElementById('msgRegistro').innerText = 'Usuário já existe.';
    return;
  }

  usuarios.push({ user: username, pass: password });
  setStorageItem('usuarios', usuarios);

  document.getElementById('msgRegistro').innerText = 'Usuário registrado com sucesso!';
  // Limpa os campos após registro
  document.getElementById('regUser').value = '';
  document.getElementById('regPass').value = '';
}

// Função para realizar logout
function logout() {
  localStorage.removeItem('logado');
  location.href = 'index.html';
}
