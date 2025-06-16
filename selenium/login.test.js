const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');

describe('Testes de Login', function() {
  this.timeout(30000);
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async () => {
    await driver.quit();
  });

  it('Deve fazer login com sucesso', async () => {
    await driver.get('http://localhost:5500/index.html'); // ajuste a URL conforme seu servidor local

    await driver.findElement(By.id('loginUser')).sendKeys('admin');
    await driver.findElement(By.id('loginPass')).sendKeys('123');
    await driver.findElement(By.css('button')).click();

    await driver.wait(until.urlContains('menu.html'), 5000);

    const urlAtual = await driver.getCurrentUrl();
    expect(urlAtual).to.include('menu.html');
  });

  it('Deve falhar ao fazer login com senha errada', async () => {
    await driver.get('http://localhost:5500/index.html');

    await driver.findElement(By.id('loginUser')).sendKeys('admin');
    await driver.findElement(By.id('loginPass')).sendKeys('senhaErrada');
    await driver.findElement(By.css('button')).click();

    const msgErro = await driver.findElement(By.id('msgLogin')).getText();
    expect(msgErro).to.equal('Senha incorreta.');
  });
});
