// crud.js

// Verifica se usuário está logado, redireciona se não
try {
  if (!localStorage.getItem('logado')) {
    location.href = 'index.html';
  }
} catch (e) {
  console.error('Erro ao verificar sessão:', e);
  location.href = 'index.html';
}

// Obtém referências aos elementos do DOM
const nameInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const messageCadastro = document.getElementById('msgCadastro');
const table = document.getElementById('tabela');

let people = getStorageItem('people') || [];
let editIndex = null;

// Se estiver na página de cadastro, tenta preencher campos para edição
try {
  if (localStorage.getItem('editIndex')) {
    const index = parseInt(localStorage.getItem('editIndex'));
    if (nameInput && emailInput && people[index]) {
      nameInput.value = people[index].name;
      emailInput.value = people[index].email;
      editIndex = index;
    }
    removeStorageItem('editIndex');
  }
} catch (e) {
  console.error('Erro ao preencher campos para edição:', e);
}

// Função para salvar ou editar pessoa
function salvarPessoa() {
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  if (!name || !email) {
    messageCadastro.innerText = 'Preencha todos os campos.';
    return;
  }

  if (!email.includes('@')) {
    messageCadastro.innerText = 'Email inválido.';
    return;
  }

  try {
    if (editIndex !== null) {
      people[editIndex] = { name, email };
      editIndex = null;
      messageCadastro.innerText = 'Pessoa editada com sucesso!';
    } else {
      people.push({ name, email });
      messageCadastro.innerText = 'Pessoa cadastrada com sucesso!';
    }
    setStorageItem('people', people);
    location.href = 'consulta.html';
  } catch (e) {
    console.error('Erro ao salvar pessoa:', e);
    messageCadastro.innerText = 'Erro interno. Tente novamente.';
  }
}

// Função para atualizar tabela na página de consulta
function updateTable() {
  if (!table) return;
  table.innerHTML = '';
  people.forEach((person, index) => {
    table.innerHTML += `
      <tr>
        <td>${person.name}</td>
        <td>${person.email}</td>
        <td>
          <button onclick="editar(${index})">Editar</button>
          <button onclick="excluir(${index})">Excluir</button>
        </td>
      </tr>
    `;
  });
}

// Função para iniciar edição
function editar(index) {
  try {
    setStorageItem('editIndex', index);
    location.href = 'cadastro.html';
  } catch (e) {
    console.error('Erro ao iniciar edição:', e);
  }
}

// Função para excluir pessoa
function excluir(index) {
  try {
    people.splice(index, 1);
    setStorageItem('people', people);
    updateTable();
  } catch (e) {
    console.error('Erro ao excluir pessoa:', e);
  }
}

// Atualiza tabela se estiver na página de consulta
updateTable();
