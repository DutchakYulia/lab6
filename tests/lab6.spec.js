// @ts-check
import { test, expect } from '@playwright/test';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const appUrl = pathToFileURL(path.resolve('app/index.html')).toString();

test.beforeEach(async ({ page }) => {
  await page.goto(appUrl);
});

test.describe('Лабораторна робота №6: користувацькі сценарії', () => {
  test('сценарій 1: реєстрація нового користувача', async ({ page }) => {
    // Перевіряємо, що користувач може створити акаунт і система показує активну сесію.
    await page.getByTestId('name-input').fill('Іван Петренко');
    await page.getByTestId('email-input').fill('ivan.petrenko@example.com');
    await page.getByTestId('password-input').fill('qwerty123');
    await page.getByTestId('city-input').fill('Івано-Франківськ');
    await page.getByTestId('register-button').click();

    await expect(page.getByTestId('register-status')).toHaveText('Акаунт успішно створено');
    await expect(page.getByTestId('session-state')).toHaveText('Користувач: Іван Петренко');
  });

  test('сценарій 2: пошук товару та додавання знайденого товару до кошика', async ({ page }) => {
    // Перевіряємо пошук за назвою товару, вибір параметрів і додавання позиції до кошика.
    await page.getByTestId('search-input').fill('клавіатура');
    await page.getByTestId('search-button').click();

    await expect(page.getByTestId('product-keyboard')).toBeVisible();
    await expect(page.getByTestId('product-mouse')).toHaveCount(0);

    await page.getByTestId('color-keyboard').selectOption('white');
    await page.getByTestId('option-keyboard').selectOption('premium');
    await page.getByTestId('add-keyboard').click();

    await expect(page.getByTestId('cart-empty')).toBeHidden();
    await expect(page.getByTestId('cart-items')).toContainText('Механічна клавіатура, white, premium');
    await expect(page.getByTestId('cart-total')).toHaveText('2 400');
  });

  test('сценарій 3: повний шлях від реєстрації до підтвердження замовлення', async ({ page }) => {
    // Перевіряємо наскрізний сценарій: акаунт, пошук, кошик, дані доставки та підтвердження покупки.
    await page.getByTestId('name-input').fill('Олена Коваль');
    await page.getByTestId('email-input').fill('olena.koval@example.com');
    await page.getByTestId('password-input').fill('secure123');
    await page.getByTestId('city-input').fill('Львів');
    await page.getByTestId('register-button').click();

    await page.getByTestId('search-input').fill('гарнітура');
    await page.getByTestId('search-button').click();
    await page.getByTestId('add-headset').click();

    await page.getByTestId('address-input').fill('вул. Шевченка, 10');
    await page.getByTestId('payment-select').selectOption('card');
    await page.getByTestId('checkout-button').click();

    await expect(page.getByTestId('checkout-status')).toHaveText(
      'Замовлення підтверджено для Олена Коваль. Сума: 1 800 грн',
    );
  });
});
