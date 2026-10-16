const base = require('@playwright/test');
const { TodoPage } = require('./pages/todo-page');

const API_URL = 'http://127.0.0.1:3001/api/todos';

const test = base.test.extend({
  todoPage: async ({ page }, use) => {
    await use(new TodoPage(page));
  },

  // Unique per-test prefix so parallel tests never collide on shared backend state
  uniqueTitle: async ({}, use, testInfo) => {
    const prefix = `ui-${testInfo.workerIndex}-${Date.now()}`;
    await use((label) => `${prefix} ${label}`);
  },

  todoApi: async ({ request }, use) => {
    const createdTitles = [];
    await use({
      async create(title) {
        const response = await request.post(API_URL, { data: { title } });
        base.expect(response.ok()).toBeTruthy();
        createdTitles.push(title);
        return response.json();
      },
      track(title) {
        createdTitles.push(title);
      },
    });

    const response = await request.get(API_URL);
    const todos = await response.json();
    const toDelete = todos.filter((todo) =>
      createdTitles.some((title) => todo.title.startsWith(title.split(' ')[0]))
    );
    await Promise.all(
      toDelete.map((todo) => request.delete(`${API_URL}/${todo.id}`))
    );
  },
});

module.exports = { test, expect: base.expect };
