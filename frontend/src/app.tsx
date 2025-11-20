import { Route, Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { Suspense, createEffect } from 'solid-js';
import WasmLoader from './lib/WasmLoader';
import { ThemeProvider } from '~/context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import './app.css';

export default function App() {
    createEffect(() => {
        WasmLoader();
    });

    return (
        <AuthProvider>
            <Router
                root={(props) => (
                    <ThemeProvider>
                        <Suspense>
                            {props.children}
                        </Suspense>
                    </ThemeProvider>
                )}
            >
                <FileRoutes />
            </Router>
        </AuthProvider>
    );
}
