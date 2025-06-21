import { Builder, By, until } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome.js';
import chromedriver from 'chromedriver';
import { expect } from 'chai';

describe('Testes de Registro de Usuários', function() {
  this.timeout(30000);
  let driver;

  before(async () => {
    chromedriver.start();
    const options = new chrome.Options();
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    await driver.get('http://localhost:5500/register.html');
    await driver.executeScript(() => {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      if (!usuarios.some(u => u.user === 'userTestExistente')) {
        usuarios.push({ user: 'userTestExistente', pass: 'senha123' });
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
      }
    });
  });

  after(async () => {
    if (driver) await driver.quit();
    chromedriver.stop();
  });

  it('Deve registrar um novo usuário com nome dinâmico', async () => {
    await driver.get('http://localhost:5500/register.html');
    await driver.sleep(1000);  // pausa 1s para "desacelerar"

    const username = 'userTest' + Date.now();

    await driver.findElement(By.id('regUser')).sendKeys(username);
    await driver.sleep(500); // pausa após digitar username

    await driver.findElement(By.id('regPass')).sendKeys('senha123');
    await driver.sleep(500); // pausa após digitar senha

    await driver.findElement(By.css('button')).click();
    await driver.sleep(1000); // pausa após clicar no botão

    const msg = await driver.findElement(By.id('msgRegistro')).getText();
    expect(msg).to.equal('Usuário registrado com sucesso!');
  });

  it('Deve falhar registro se usuário já existe', async () => {
    await driver.get('http://localhost:5500/register.html');
    await driver.sleep(1000);

    await driver.findElement(By.id('regUser')).sendKeys('userTestExistente');
    await driver.sleep(500);

    await driver.findElement(By.id('regPass')).sendKeys('senha123');
    await driver.sleep(500);

    await driver.findElement(By.css('button')).click();
    await driver.sleep(1000);

    const msg = await driver.findElement(By.id('msgRegistro')).getText();
    expect(msg).to.equal('Usuário já existe.');
  });
});
