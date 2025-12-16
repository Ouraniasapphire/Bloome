import type { Class } from "./Class";

export type Membership = {
    id: string;
    role: string;
    classes: Class | null;
};