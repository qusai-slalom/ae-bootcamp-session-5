const { expect } = require('@playwright/test');

class TodoPage {
  constructor(page) {
    this.page = page;
    this.newTodoInput = page.getByPlaceholder('What needs to be done?');
    this.addButton = page.getByRole('button', { name: 'Add', exact: true });
    this.editInput = page.getByRole('textbox', { name: 'Edit todo title' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.alert = page.getByRole('alert');
  }

  async goto() {
    await this.page.goto('/');
  }

  todoItem(title) {
    return this.page.getByRole('listitem').filter({ hasText: title });
  }

  checkbox(title) {
    return this.page.getByRole('checkbox', { name: `Toggle ${title}` });
  }

  async addTodo(title) {
    await this.newTodoInput.fill(title);
    await this.addButton.click();
  }

  async toggleTodo(title) {
    await this.checkbox(title).click();
  }

  async editTodo(oldTitle, newTitle) {
    await this.page.getByRole('button', { name: `Edit ${oldTitle}` }).click();
    await this.editInput.fill(newTitle);
    await this.saveButton.click();
  }

  async deleteTodo(title) {
    await this.page.getByRole('button', { name: `Delete ${title}` }).click();
  }

  async expectTodoVisible(title) {
    await expect(this.todoItem(title)).toBeVisible();
  }

  async expectTodoAbsent(title) {
    await expect(this.todoItem(title)).toHaveCount(0);
  }
}

module.exports = { TodoPage };
