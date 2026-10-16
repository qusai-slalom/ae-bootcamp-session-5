const { test, expect } = require('./fixtures');

test.describe('TODO critical journeys', () => {
  test('creates a new todo', async ({ todoPage, todoApi, uniqueTitle }) => {
    const title = uniqueTitle('create');
    todoApi.track(title);
    await todoPage.goto();

    await todoPage.addTodo(title);

    await todoPage.expectTodoVisible(title);
    await expect(todoPage.checkbox(title)).not.toBeChecked();
    await expect(todoPage.newTodoInput).toHaveValue('');
  });

  test('toggles a todo complete and back', async ({
    todoPage,
    todoApi,
    uniqueTitle,
  }) => {
    const title = uniqueTitle('toggle');
    await todoApi.create(title);
    await todoPage.goto();

    await todoPage.toggleTodo(title);
    await expect(todoPage.checkbox(title)).toBeChecked();

    await todoPage.toggleTodo(title);
    await expect(todoPage.checkbox(title)).not.toBeChecked();
  });

  test('edits a todo title', async ({ todoPage, todoApi, uniqueTitle }) => {
    const original = uniqueTitle('edit-before');
    const updated = uniqueTitle('edit-after');
    await todoApi.create(original);
    await todoPage.goto();

    await todoPage.editTodo(original, updated);

    await todoPage.expectTodoVisible(updated);
    await todoPage.expectTodoAbsent(original);
  });

  test('deletes a todo', async ({ todoPage, todoApi, uniqueTitle }) => {
    const title = uniqueTitle('delete');
    await todoApi.create(title);
    await todoPage.goto();
    await todoPage.expectTodoVisible(title);

    await todoPage.deleteTodo(title);

    await todoPage.expectTodoAbsent(title);
  });

  test('shows an error when the API is unavailable', async ({
    page,
    todoPage,
  }) => {
    await page.route('**/api/todos', (route) => route.abort());
    await todoPage.goto();

    await expect(todoPage.alert).toContainText(/failed to load todos/i);
  });
});
