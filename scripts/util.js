// util.js - Utilitários para persistência e sessão

// Função para obter dados do localStorage com parse seguro
function getStorageItem(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error(`Erro ao obter item "${key}" do localStorage:`, e);
      return null;
    }
  }
  
  // Função para salvar dados no localStorage com stringify
  function setStorageItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Erro ao salvar item "${key}" no localStorage:`, e);
    }
  }
  
  // Função para remover item do localStorage
  function removeStorageItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Erro ao remover item "${key}" do localStorage:`, e);
    }
  }
  
  // Função para verificar se usuário está logado
  function isUserLogged() {
    return !!localStorage.getItem('logado');
  }
  
  // Função para obter usuário logado
  function getLoggedUser() {
    return localStorage.getItem('logado') || null;
  }
  
  // Função para fazer logout (remover sessão)
  function logoutUser() {
    removeStorageItem('logado');
    location.href = 'index.html';
  }
  
  // Função para limpar dados de edição (como o editIndex)
  function clearEditData() {
    removeStorageItem('editIndex');
  }
  
  // Função para inicializar dados padrão (ex: usuários e pessoas)
  function initializeData() {
    if (!getStorageItem('usuarios')) {
      setStorageItem('usuarios', [{ user: 'admin', pass: '123' }]);
    }
    if (!getStorageItem('people')) {
      setStorageItem('people', []);
    }
  }
  