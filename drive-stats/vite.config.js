import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            assets: path.resolve(__dirname, './assets'), // Add this alias for assets
        },
    },
    server: {
        host: true,
        strictPort: true,
        watch: {
            usePolling: true,
        },
    },
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
            },
        },
    },
})
