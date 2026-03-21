const { test } = require('@playwright/test');

exports.customTest = test.extend(
    {
        testsetForOerder: async ({ }, use) => {
            await use({
                username: "testqwerty@yopmail.com",
                password: "Test@123",
                productName: "ZARA COAT 3"
            });
        }
    });