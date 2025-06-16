const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');

describe('Testes de Cadastro, Edição e Exclusão', function() {
  this.timeout(60000);
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async () => {
    await driver.quit();
  });

  it('Deve cadastrar uma pessoa', async () => {
    await driver.get('http://localhost:5500/cadastro.html');

    await driver.findElement(By.id('nome')).sendKeys('Teste Pessoa');
    await driver.findElement(By.id('email')).sendKeys('teste@teste.com');
    await driver.findElement(By.css('button')).click();

    const msg = await driver.findElement(By.id('msgCadastro')).getText();
    expect(msg).to.include('Pessoa salva com sucesso!');
  });

  it('Deve editar uma pessoa', async () => {
    await driver.get('http://localhost:5500/consulta.html');

    // Espera tabela carregar
    await driver.wait(until.elementLocated(By.css('#tabela button.edit')), 5000);

    // Clica no botão de editar da primeira linha
    await driver.findElement(By.css('#tabela button.edit')).click();

    // Altera o nome
    const nomeInput = await driver.findElement(By.id('nome'));
    await nomeInput.clear();
    await nomeInput.sendKeys('Pessoa Editada');

    // Salva
    await driver.findElement(By.css('button')).click();

    const msg = await driver.findElement(By.id('msgCadastro')).getText();
    expect(msg).to.include('Pessoa salva com sucesso!');
  });

  it('Deve excluir uma pessoa', async () => {
    await driver.get('http://localhost:5500/consulta.html');

    // Espera tabela carregar
    await driver.wait(until.elementLocated(By.css('#tabela button.delete')), 5000);

    // Clica no botão de excluir da primeira linha
    await driver.findElement(By.css('#tabela button.delete')).click();

    // Confirma exclusão (supondo alert)
    await driver.switchTo().alert().accept();

    // Confirma exclusão na UI (exemplo)
    await driver.wait(until.stalenessOf(driver.findElement(By.css('#tabela tr'))), 5000);
  });
});
