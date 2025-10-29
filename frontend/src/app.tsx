import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { Suspense } from 'solid-js';
import WasmLoader from './lib/WasmLoader';
import { createEffect } from 'solid-js';
import './app.css';
import { ThemeProvider } from '~/context/ThemeContext';

export default function App() {
    createEffect(() => {
        WasmLoader();
    });

    return (
        <Router
            root={(props) => (
                <>
                    <ThemeProvider>
                        <Suspense>{props.children}</Suspense>
                    </ThemeProvider>
                </>
            )}
        >
            <FileRoutes />
        </Router>
    );
}
