import { ConfigModuleOptions, registerAs } from '@nestjs/config';

export const baseEnvConfig: ConfigModuleOptions = {
  envFilePath: ['local.env'],
  ignoreEnvFile: process.env.NODE_ENV === 'production',
};

type EnvType = {
  host: string;
  inDev: boolean;
  port: number;
  inTest: boolean;
  apiPrefix: string;
};

export const BASE_ENV = 'base';

export const baseEnv = registerAs(
  BASE_ENV,
  (): EnvType => ({
    host: process.env.API_HOST || '',
    inDev: process.env.NODE_ENV !== 'production',
    port: parseInt(process.env.PORT) || 3001,
    inTest: process.env.NODE_ENV === 'test',
    apiPrefix: process.env.API_PREFIX || 'api',
  }),
);
