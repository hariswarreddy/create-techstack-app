<script setup>
import { ref } from 'vue';

const count = ref(0);
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1>Welcome to {{projectName}}</h1>
      <p>Built with Vue + Vite 💚</p>
      
      <div class="card">
        <button @click="count++">
          Count is {{ count }}
        </button>
        <p>
          Edit <code>src/App.vue</code> and save to test HMR
        </p>
      </div>
      
      <p class="read-the-docs">
        Click on the Vite and Vue logos to learn more
      </p>
    </header>
  </div>
</template>

<style scoped>
.app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.app-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
  background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card {
  padding: 2em;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  color: #fff;
  cursor: pointer;
  transition: all 0.25s ease;
}

button:hover {
  background-color: #42b883;
  border-color: #42b883;
  transform: scale(1.05);
}

.read-the-docs {
  color: #888;
}

code {
  background: #1a1a1a;
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-size: 0.9em;
}
</style>
