import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rolldownOptions: {
            input: {
                main: resolve(import.meta.dirname, 'index.html'),
                batalha: resolve(import.meta.dirname, 'batalha-naval.html')
            }
        }
    }
});