import {
  Button,
  Container,
  Text,
  Title,
  Modal,
  TextInput,
  Group,
  Card,
  ActionIcon,
  MantineProvider,
  ColorSchemeProvider,
} from "@mantine/core";

import { useState, useRef, useEffect } from "react";
import { MoonStars, Sun, Trash } from "tabler-icons-react";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [opened, setOpened] = useState(false);

  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
  });

  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  const taskTitle = useRef(null);
  const taskSummary = useRef(null);

  function saveTasks(updatedTasks) {
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  }

  function loadTasks() {
    const loadedTasks = localStorage.getItem("tasks");

    if (loadedTasks) {
      setTasks(JSON.parse(loadedTasks));
    }
  }

  function createTask() {
    const newTask = {
      title: taskTitle.current.value,
      summary: taskSummary.current.value,
    };

    const updatedTasks = [...tasks, newTask];

    setTasks(updatedTasks);
    saveTasks(updatedTasks);

    taskTitle.current.value = "";
    taskSummary.current.value = "";
  }

  function deleteTask(index) {
    const updatedTasks = tasks.filter((_, i) => i !== index);

    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme, defaultRadius: "md" }}
        withGlobalStyles
        withNormalizeCSS
      >
        <div className="App">
          <Modal
            opened={opened}
            size="md"
            title="New Task"
            centered
            onClose={() => setOpened(false)}
          >
            <TextInput
              mt="md"
              ref={taskTitle}
              placeholder="Task Title"
              required
              label="Title"
            />

            <TextInput
              mt="md"
              ref={taskSummary}
              placeholder="Task Summary"
              label="Summary"
            />

            <Group mt="md" position="apart">
              <Button variant="subtle" onClick={() => setOpened(false)}>
                Cancel
              </Button>

              <Button
                onClick={() => {
                  createTask();
                  setOpened(false);
                }}
              >
                Create Task
              </Button>
            </Group>
          </Modal>

          <Container size={550} my={40}>
            <Group position="apart">
              <Title
                sx={(theme) => ({
                  fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                  fontWeight: 900,
                })}
              >
                My Tasks
              </Title>

              <ActionIcon
                color="blue"
                size="lg"
                onClick={() => toggleColorScheme()}
              >
                {colorScheme === "dark" ? (
                  <Sun size={16} />
                ) : (
                  <MoonStars size={16} />
                )}
              </ActionIcon>
            </Group>

            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <Card withBorder key={index} mt="sm">
                  <Group position="apart">
                    <Text weight="bold">{task.title}</Text>

                    <ActionIcon
                      color="red"
                      variant="transparent"
                      onClick={() => deleteTask(index)}
                    >
                      <Trash />
                    </ActionIcon>
                  </Group>

                  <Text color="dimmed" size="md" mt="sm">
                    {task.summary
                      ? task.summary
                      : "No summary was provided for this task"}
                  </Text>
                </Card>
              ))
            ) : (
              <Text size="lg" mt="md" color="dimmed">
                You have no tasks
              </Text>
            )}

            <Button fullWidth mt="md" onClick={() => setOpened(true)}>
              New Task
            </Button>
          </Container>
        </div>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}