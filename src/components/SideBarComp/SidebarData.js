import { BookOpenText, Search, LayoutDashboard, Settings } from 'lucide-react';


export const sidebar_data = [
    { name: 'Dashboard', icon: LayoutDashboard, link: '/dashboard' },
    { name: 'My Courses', icon: BookOpenText, link: '/courses' },
    { name: 'Search', icon: Search, link: '/search' },
    { name: 'Settings', icon: Settings, action: 'settings' },
]