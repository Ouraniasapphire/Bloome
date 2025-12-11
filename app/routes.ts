import { type RouteConfig, index } from '@react-router/dev/routes';

export default [
    index('routes/home.tsx'),
    {
        path: ':userID/dashboard',
        file: 'routes/dashboard/page.tsx',
    },
    {
        path: 'redirect',
        file: 'routes/redirect.tsx',
    },
    {
        path: ':userid/settings',
        file: 'routes/settings/page.tsx'
    },
    {
        path: ':userid/studio-manager',
        file: 'routes/studioManager/page.tsx'
    }
] satisfies RouteConfig;
