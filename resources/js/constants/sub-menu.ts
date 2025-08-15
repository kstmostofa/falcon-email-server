import type { NavItem } from '@/types';
import {
    Computer,
    File,
    FileDigit,
    LayoutGrid,
    ListChecks,
    ListTodo,
    Mail,
    Mailbox,
    Server,
    Settings,
    Text,
    TextQuote,
    User,
    Users,
} from 'lucide-react';

export const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
        show: true,
    },
    {
        title: 'Contacts',
        href: route('contacts.index'),
        icon: Users,
        show: true,
    },
    {
        title: 'Sender Name',
        href: route('sender_name.index'),
        icon: User,
        show: true,
    },
    {
        title: 'Subjects',
        href: route('subjects.index'),
        icon: Text,
        show: true,
    },
    {
        title: 'Templates',
        href: route('templates.index'),
        icon: TextQuote,
        show: true,
    },
    {
        title: 'Attachments',
        href: route('attachments.index'),
        icon: File,
        show: true,
    },
    {
        title: 'SMTP',
        href: route('smtp.index'),
        icon: Mail,
        show: true,
    },
    {
        title: 'Providers',
        href: route('providers.index'),
        icon: Server,
        show: true,
    },
    {
        title: 'Tasks',
        href: '#',
        icon: ListChecks,
        show: true,
        subItems: [
            {
                title: 'Mailing Task',
                href: route('tasks.index'),
                icon: ListTodo,
                show: true,
            },
            {
                title: 'API Generation Task',
                href: route('gmail_api_tasks.index'),
                icon: ListTodo,
                show: true,
            },
        ],
    },
    {
        title: 'Vps',
        href: route('vps.index'),
        icon: Computer,
        show: true,
    },
    {
        title: 'Settings',
        href: '#',
        icon: Settings,
        show: true,
        subItems: [
            {
                title: 'Api Credentials',
                href: '#',
                icon: FileDigit,
                show: true,
            },
        ],
    },
];
