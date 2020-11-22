import { app_config as config } from '../../app-config';

export const environment = {
  production: false,
  api: {
    domain: config.localUrl,
    url: `http://${config.localUrl}/api/`
  },
};
