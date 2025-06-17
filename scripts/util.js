// util.js - Utilitários para persistência e sessão no localStorage

// ✅ Função para obter dados do localStorage com parse seguro
function getStorageItem(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.error(`Erro ao obter item "${key}" do localStorage:`, e);
    return null;
  }
}

// ✅ Função para salvar dados no localStorage com stringify seguro
function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Erro ao salvar item "${key}" no localStorage:`, e);
  }
}

// ✅ Função para remover item do localStorage
function removeStorageItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error(`Erro ao remover item "${key}" do localStorage:`, e);
  }
}

// ✅ Verifica se o usuário está logado (existe 'logado' no localStorage)
function isUserLogged() {
  return !!localStorage.getItem('logado');
}

// ✅ Retorna o nome ou identificador do usuário logado
function getLoggedUser() {
  return localStorage.getItem('logado') || null;
}

// ✅ Faz logout removendo o item de sessão e redirecionando
function logoutUser() {
  removeStorageItem('logado');
  location.href = 'index.html';
}

// ✅ Limpa dados temporários de edição
function clearEditData() {
  removeStorageItem('editIndex');
}

// ✅ Inicializa dados padrões caso não existam no localStorage
function initializeData() {
  if (!getStorageItem('usuarios')) {
    setStorageItem('usuarios', [
      { user: 'admin', pass: '123' }
    ]);
  }

  if (!getStorageItem('people')) {
    setStorageItem('people', []);
  }
}
