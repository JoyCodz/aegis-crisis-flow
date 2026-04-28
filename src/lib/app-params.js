// App params — local mode
export const appParams = {
    appId: 'aegis-local',
    token: null,
    fromUrl: typeof window !== 'undefined' ? window.location.href : '',
    functionsVersion: 'local',
    appBaseUrl: typeof window !== 'undefined' ? window.location.origin : '',
};
