import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

const jsonResponse = (body, ok = true, status = 200) =>
  Promise.resolve({ ok, status, json: () => Promise.resolve(body) });

const renderApp = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>
  );
};

const sampleTodos = [
  { id: 1, title: 'Buy milk', completed: false },
  { id: 2, title: 'Walk dog', completed: true },
  { id: 3, title: 'Write code', completed: false },
];

beforeEach(() => {
  global.fetch = jest.fn((url, options = {}) => {
    if (!options.method || options.method === 'GET') {
      return jsonResponse(sampleTodos);
    }
    return jsonResponse({});
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

test('renders TODO App heading', async () => {
  renderApp();
  expect(await screen.findByText(/TODO App/i)).toBeInTheDocument();
});

test('fetches todos using a relative API URL', async () => {
  renderApp();
  await screen.findByText('Buy milk');
  expect(global.fetch).toHaveBeenCalledWith('/api/todos');
});

describe('stats', () => {
  test('shows incomplete and completed counts calculated from todos', async () => {
    renderApp();
    expect(await screen.findByText('2 items left')).toBeInTheDocument();
    expect(screen.getByText('1 completed')).toBeInTheDocument();
  });
});

describe('empty state', () => {
  test('shows empty state message when there are no todos', async () => {
    global.fetch.mockImplementation(() => jsonResponse([]));
    renderApp();
    expect(await screen.findByText(/no todos yet/i)).toBeInTheDocument();
  });

  test('does not show empty state message when todos exist', async () => {
    renderApp();
    await screen.findByText('Buy milk');
    expect(screen.queryByText(/no todos yet/i)).not.toBeInTheDocument();
  });
});

describe('delete', () => {
  test('deletes a todo by calling the DELETE endpoint', async () => {
    const user = userEvent.setup();
    renderApp();
    await screen.findByText('Buy milk');

    await user.click(screen.getByRole('button', { name: /delete buy milk/i }));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith('/api/todos/1', {
        method: 'DELETE',
      })
    );
  });
});

describe('edit', () => {
  test('edits a todo and saves via the PUT endpoint', async () => {
    const user = userEvent.setup();
    renderApp();
    await screen.findByText('Buy milk');

    await user.click(screen.getByRole('button', { name: /edit buy milk/i }));
    const input = screen.getByRole('textbox', { name: /edit todo title/i });
    await user.clear(input);
    await user.type(input, 'Buy oat milk');
    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith('/api/todos/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Buy oat milk' }),
      })
    );
  });

  test('cancels editing without saving', async () => {
    const user = userEvent.setup();
    renderApp();
    await screen.findByText('Buy milk');

    await user.click(screen.getByRole('button', { name: /edit buy milk/i }));
    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(screen.getByText('Buy milk')).toBeInTheDocument();
    const putCalls = global.fetch.mock.calls.filter(
      ([, opts]) => opts && opts.method === 'PUT'
    );
    expect(putCalls).toHaveLength(0);
  });
});

describe('error handling', () => {
  test('shows an error message when fetching todos fails', async () => {
    global.fetch.mockImplementation(() =>
      Promise.reject(new Error('Network down'))
    );
    renderApp();
    const alert = await screen.findByRole('alert');
    expect(within(alert).getByText(/failed to load todos/i)).toBeInTheDocument();
  });

  test('shows an error message when the API responds with an error status', async () => {
    global.fetch.mockImplementation(() =>
      jsonResponse({ error: 'Server error' }, false, 500)
    );
    renderApp();
    expect(await screen.findByRole('alert')).toHaveTextContent(
      /failed to load todos/i
    );
  });

  test('shows an error message when a mutation fails', async () => {
    const user = userEvent.setup();
    global.fetch.mockImplementation((url, options = {}) => {
      if (options.method === 'DELETE') {
        return jsonResponse({ error: 'Todo not found' }, false, 404);
      }
      return jsonResponse(sampleTodos);
    });
    renderApp();
    await screen.findByText('Buy milk');

    await user.click(screen.getByRole('button', { name: /delete buy milk/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /todo not found/i
    );
  });
});
