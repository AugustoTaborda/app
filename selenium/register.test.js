const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');

describe('Testes de Registro de Usuários', function() {
  this.timeout(30000);
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async () => {
    await driver.quit();
  });

  it('Deve registrar um novo usuário', async () => {
    await driver.get('http://localhost:5500/register.html');

    const username = 'userTest' + Date.now();

    await driver.findElement(By.id('regUser')).sendKeys(username);
    await driver.findElement(By.id('regPass')).sendKeys('senha123');
    await driver.findElement(By.css('button')).click();

    const msg = await driver.findElement(By.id('msgRegistro')).getText();
    expect(msg).to.equal('Usuário registrado com sucesso!');
  });

  it('Deve falhar registro se usuário já existe', async () => {
    await driver.get('http://localhost:5500/register.html');

    await driver.findElement(By.id('regUser')).sendKeys('admin');
    await driver.findElement(By.id('regPass')).sendKeys('123');
    await driver.findElement(By.css('button')).click();

    const msg = await driver.findElement(By.id('msgRegistro')).getText();
    expect(msg).to.equal('Usuário já existe.');
  });
});
