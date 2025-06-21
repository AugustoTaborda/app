import { Builder, By, until } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome.js';
import chromedriver from 'chromedriver';
import { expect } from 'chai';

describe('Testes de Login', function() {
  this.timeout(30000);
  let driver;

  before(async () => {
    chromedriver.start();
    const options = new chrome.Options();
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    // Garante que o usuário 'userTestExistente' está cadastrado antes dos testes
    await driver.get('http://localhost:5500/register.html');
    await driver.executeScript(() => {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const existe = usuarios.some(u => u.user === 'userTestExistente');
      if (!existe) {
        usuarios.push({ user: 'userTestExistente', pass: 'senha123' });
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
      }
    });
    await driver.sleep(1000);
  });

  after(async () => {
    if (driver) await driver.quit();
    chromedriver.stop();
  });

  beforeEach(async () => {
    // Limpa dados antes de cada teste para evitar interferência
    await driver.executeScript('localStorage.removeItem("logado");');
    await driver.sleep(500);
  });

  it('Deve falhar ao fazer login com senha errada', async () => {
    await driver.get('http://localhost:5500/index.html');
    await driver.sleep(1000);

    await driver.findElement(By.id('loginUser')).sendKeys('userTestExistente');
    await driver.sleep(500);

    await driver.findElement(By.id('loginPass')).sendKeys('senhaErrada');
    await driver.sleep(500);

    await driver.findElement(By.css('button')).click();
    await driver.sleep(1000);

    const msgErro = await driver.findElement(By.id('msgLogin')).getText();
    expect(msgErro).to.equal('Senha incorreta.');
  });

  it('Deve fazer login com sucesso', async () => {
    await driver.get('http://localhost:5500/index.html');
    await driver.sleep(1000);

    await driver.findElement(By.id('loginUser')).sendKeys('userTestExistente');
    await driver.sleep(500);

    await driver.findElement(By.id('loginPass')).sendKeys('senha123');
    await driver.sleep(500);

    await driver.findElement(By.css('button')).click();
    await driver.wait(until.urlContains('menu.html'), 5000);
    await driver.sleep(1000);

    const urlAtual = await driver.getCurrentUrl();
    expect(urlAtual).to.include('menu.html');
  });
});
