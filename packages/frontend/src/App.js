import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  Checkbox,
  IconButton,
  Paper,
  CircularProgress,
  Chip,
  Stack,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import './App.css';

// Relative URL so requests go through the CRA dev proxy (see package.json "proxy")
const API_URL = '/api/todos';

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      data.error || `Request failed with status ${response.status}`
    );
  }
  return data;
};

// React Query hook for fetching todos
const useTodos = () => {
  return useQuery({
    queryKey: ['todos'],
    queryFn: async () => parseResponse(await fetch(API_URL)),
  });
};

function App() {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const queryClient = useQueryClient();

  // Fetch todos using React Query
  const { data: todos = [], isLoading, isError } = useTodos();

  // Mutation for adding a new todo
  const addTodoMutation = useMutation({
    mutationFn: async (title) => {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      return parseResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setNewTodoTitle('');
    },
  });

  // Mutation for toggling todo completion
  const toggleTodoMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`${API_URL}/${id}/toggle`, {
        method: 'PATCH',
      });
      return parseResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      return parseResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: async ({ id, title }) => {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      return parseResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setEditingId(null);
      setEditTitle('');
    },
  });

  const failedMutation = [
    addTodoMutation,
    toggleTodoMutation,
    deleteTodoMutation,
    updateTodoMutation,
  ].find((mutation) => mutation.isError);

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  const handleAddTodo = (e) => {
    e.preventDefault();
    const title = newTodoTitle.trim();
    if (title) {
      addTodoMutation.mutate(title);
    }
  };

  const handleToggleTodo = (id) => {
    toggleTodoMutation.mutate(id);
  };

  const handleDeleteTodo = (id) => {
    deleteTodoMutation.mutate(id);
  };

  const handleStartEdit = (todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const title = editTitle.trim();
    if (title) {
      updateTodoMutation.mutate({ id: editingId, title });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            TODO App
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Session 5: Agentic Development
          </Typography>
        </Paper>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box
              component="form"
              onSubmit={handleAddTodo}
              sx={{ display: 'flex', gap: 2 }}
            >
              <TextField
                fullWidth
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                placeholder="What needs to be done?"
                variant="outlined"
                size="medium"
              />
              <Button
                type="submit"
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ minWidth: 120 }}
              >
                Add
              </Button>
            </Box>
          </CardContent>
        </Card>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {isError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Failed to load todos. Please make sure the server is running and
            try again.
          </Alert>
        )}

        {failedMutation && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            onClose={() => failedMutation.reset()}
          >
            {failedMutation.error.message}
          </Alert>
        )}

        {!isLoading && !isError && todos.length === 0 && (
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No todos yet. Add one above to get started!
            </Typography>
          </Card>
        )}

        {todos.length > 0 && (
          <Card>
            <List sx={{ p: 0 }}>
              {todos.map((todo, index) => (
                <ListItem
                  key={todo.id}
                  sx={{
                    borderBottom: index < todos.length - 1 ? 1 : 0,
                    borderColor: 'divider',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <Checkbox
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo.id)}
                    inputProps={{ 'aria-label': `Toggle ${todo.title}` }}
                    sx={{ mr: 2 }}
                  />
                  {editingId === todo.id ? (
                    <Box
                      component="form"
                      onSubmit={handleSaveEdit}
                      sx={{ display: 'flex', flex: 1, gap: 1 }}
                    >
                      <TextField
                        fullWidth
                        size="small"
                        autoFocus
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        inputProps={{ 'aria-label': 'Edit todo title' }}
                      />
                      <Button type="submit" variant="contained" size="small">
                        Save
                      </Button>
                      <Button size="small" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                    </Box>
                  ) : (
                    <>
                      <Typography
                        sx={{
                          flex: 1,
                          textDecoration: todo.completed
                            ? 'line-through'
                            : 'none',
                          color: todo.completed
                            ? 'text.secondary'
                            : 'text.primary',
                        }}
                      >
                        {todo.title}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          size="small"
                          color="primary"
                          aria-label={`Edit ${todo.title}`}
                          onClick={() => handleStartEdit(todo)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          aria-label={`Delete ${todo.title}`}
                          onClick={() => handleDeleteTodo(todo.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </>
                  )}
                </ListItem>
              ))}
            </List>
          </Card>
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Chip label={`${activeCount} items left`} color="primary" />
          <Chip label={`${completedCount} completed`} color="success" />
        </Box>
      </Container>
    </Box>
  );
}

export default App;
