import React from 'react';
import Login from '../pages/Login'
import Dispatch from '../pages/Dispatch'
import { SettingOutlined } from '@ant-design/icons'

export type Trouters = Array<any>;

type TRouter = {
    path: string,
    name: string,
    icon?: React.ReactElement,
    view: string | Function | Object,
    isMenu: boolean,
    isEnd?: boolean,
}

const routers: Array<TRouter> = [
    {
        path: 'login',
        name: 'Login',
        view: '@/pages/Login',
        isMenu: false,
    },
    {
        path: 'setting',
        name: 'Login',
        view: '@/pages/Login',
        isMenu: false,
        icon: React.createElement(SettingOutlined, null, null),
        isEnd: true
    },
]

export default routers;