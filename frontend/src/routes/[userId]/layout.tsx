// routes/[userid]/layout.tsx
import { JSX } from 'solid-js';
import Nav from '~/components/Nav/Nav';

export default function AppLayout(props: { children: JSX.Element }) {
    return <>{props.children}</>;
}
