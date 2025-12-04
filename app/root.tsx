import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useNavigate,
} from 'react-router';

import type { Route } from './+types/root';
import './app.css';

import { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './clients/supabaseClient';

import Navbar from './components/Navbar/Navbar';
import { ThemeProvider } from './context/ThemeContext';

export const links: Route.LinksFunction = () => [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
    },
    {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
    },
];

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en'>
            <head>
                <meta charSet='utf-8' />
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <Meta />
                <Links />
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    const [session, setSession] = useState<Session | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is already logged in
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    });

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            setSession(null);
            navigate('/'); // optional: redirect to home after sign out
        }
    };
                  
    if (session) {
        return (
            <ThemeProvider>
                <Navbar>
                    <button
                        onClick={signOut}
                        className='px-4 py-2 bg-linear-to-t from-purple-700 to-indigo-600 text-white rounded-lg hover:cursor-pointer w-full mb-4 mr-4 mt-2 ml-4'
                    >
                        Sign out
                    </button>
                </Navbar>
                <Outlet />
            </ThemeProvider>
        );
    } else {
        return <Outlet />;
    }
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    let message = 'Oops!';
    let details = 'An unexpected error occurred.';
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? '404' : 'Error';
        details =
            error.status === 404
                ? 'The requested page could not be found.'
                : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <main className='pt-16 p-4 container mx-auto'>
            <h1>{message}</h1>
            <p>{details}</p>
            {stack && (
                <pre className='w-full p-4 overflow-x-auto'>
                    <code>{stack}</code>
                </pre>
            )}
        </main>
    );
}
