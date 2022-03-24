export enum RESPONSE_STSTUS {
    'NOT_FOUND' = '1404',
    'WRONG_PASSWORD' = '1403',
    'NETWORK_ERROR' = '1500',
}

export function doResponse(message: string) {
    if (message === 'withoutAuth') window.location.hash = '#/login';
}