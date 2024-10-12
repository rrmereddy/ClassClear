import { BookOpenText, LayoutDashboard, Settings } from 'lucide-react';


export const sidebar_data = [
    { name: 'Dashboard', icon: LayoutDashboard, link: '/dashboard' },
    { name: 'My Courses', icon: BookOpenText, link: '/courses' },
    { name: 'Settings', icon: Settings, action: 'settings' },
]