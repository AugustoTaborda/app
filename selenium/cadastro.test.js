import { Builder, By, until } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome.js';
import chromedriver from 'chromedriver';
import { expect } from 'chai';

describe('Testes de Cadastro, Edição e Exclusão', function () {
  this.timeout(60000);
  let driver;

  before(async () => {
    chromedriver.start();
    const options = new chrome.Options();
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    await driver.get('http://localhost:5500/register.html');
    await driver.sleep(1000);

    await driver.executeScript(() => {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const existe = usuarios.some(u => u.user === 'userTestExistente');
      if (!existe) {
        usuarios.push({ user: 'userTestExistente', pass: 'senha123' });
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
      }
    });

    await driver.get('http://localhost:5500/index.html');
    await driver.sleep(1000);

    await driver.findElement(By.id('loginUser')).sendKeys('userTestExistente');
    await driver.sleep(500);

    await driver.findElement(By.id('loginPass')).sendKeys('senha123');
    await driver.sleep(500);

    await driver.findElement(By.css('button')).click();
    await driver.wait(until.urlContains('menu.html'), 5000);
    await driver.sleep(1000);
  });

  after(async () => {
    if (driver) await driver.quit();
    chromedriver.stop();
  });

  it('Deve cadastrar uma pessoa', async () => {
    await driver.get('http://localhost:5500/cadastro.html');
    await driver.sleep(1000);

    await driver.findElement(By.id('nome')).sendKeys('Teste Pessoa');
    await driver.sleep(500);

    await driver.findElement(By.id('email')).sendKeys('teste@teste.com');
    await driver.sleep(1000);

    await driver.findElement(By.css('button')).click();

    // Aguarda o texto da mensagem de sucesso
    await driver.wait(until.elementTextContains(
      driver.findElement(By.id('msgCadastro')),
      'Pessoa cadastrada com sucesso!'
    ), 2000);
  });

  it('Deve editar uma pessoa', async () => {
    await driver.get('http://localhost:5500/consulta.html');
    await driver.sleep(1000);

    await driver.wait(until.elementLocated(By.css('#tabela button.edit')), 5000);
    const editarBtn = await driver.findElement(By.css('#tabela button.edit'));
    await editarBtn.click();
    await driver.sleep(1000);

    const nomeInput = await driver.findElement(By.id('nome'));
    await nomeInput.clear();
    await driver.sleep(500);

    await nomeInput.sendKeys('Pessoa Editada');
    await driver.sleep(1000);

    await driver.findElement(By.css('button')).click();

    // Aguarda o texto da mensagem de sucesso da edição
    await driver.wait(until.elementTextContains(
      driver.findElement(By.id('msgCadastro')),
      'Pessoa editada com sucesso!'
    ), 2000);
  });

  it('Deve excluir uma pessoa', async () => {
    await driver.get('http://localhost:5500/consulta.html');

    await driver.wait(until.elementLocated(By.css('#tabela button.delete')), 5000);
    const excluirBtn = await driver.findElement(By.css('#tabela button.delete'));
    await excluirBtn.click();

    await driver.switchTo().alert().accept();

    await driver.wait(async () => {
      const linhas = await driver.findElements(By.css('#tabela tbody tr'));
      return linhas.length === 0;
    }, 5000);
  });
});
