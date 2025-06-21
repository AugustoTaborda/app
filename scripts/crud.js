// crud.js

// Verifica se usuário está logado
if (!isUserLogged()) {
  location.href = 'index.html';
}

// Elementos da página (caso existam)
const nameInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const messageCadastro = document.getElementById('msgCadastro');
const table = document.getElementById('tabela');

let people = getStorageItem('people') || [];
let editIndex = null;

// Preenche campos se estiver editando
if (nameInput && emailInput && messageCadastro) {
  const storedIndex = getStorageItem('editIndex');
  const index = storedIndex !== null ? Number(storedIndex) : null;

  if (index !== null && !isNaN(index) && people[index]) {
    nameInput.value = people[index].name;
    emailInput.value = people[index].email;
    editIndex = index;
    clearEditData(); // limpa do localStorage
  }
}

// Função chamada no botão "Salvar"
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

  people = getStorageItem('people') || [];

  if (editIndex !== null) {
    people[editIndex] = { name, email };
    messageCadastro.innerText = 'Pessoa editada com sucesso!';
  } else {
    people.push({ name, email });
    messageCadastro.innerText = 'Pessoa cadastrada com sucesso!';
  }

  setStorageItem('people', people);
  setTimeout(() => {
    location.href = 'consulta.html';
  }, 500);
}

// Atualiza a tabela de consulta (caso esteja na tela)
function updateTable() {
  if (!table) return;

  people = getStorageItem('people') || [];
  table.innerHTML = '';

  people.forEach((person, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${person.name}</td>
      <td>${person.email}</td>
      <td>
        <button class="edit" onclick="editar(${index})">Editar</button>
        <button class="delete" onclick="excluir(${index})">Excluir</button>
      </td>
    `;
    table.appendChild(row);
  });
}

// Editar
function editar(index) {
  setStorageItem('editIndex', index);
  location.href = 'cadastro.html';
}


function excluir(index) {
  if (confirm('Tem certeza que deseja excluir esta pessoa?')) {
    people = getStorageItem('people') || [];
    people.splice(index, 1);
    setStorageItem('people', people);
    updateTable();
  }
}

// Se estiver na consulta.html, monta a tabela
if (table) {
  updateTable();
}
