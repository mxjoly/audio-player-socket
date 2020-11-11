declare const __BROWSER__: boolean;
declare const __SERVER__: boolean;

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    HOST: string;
  }
}

declare namespace Express {
  interface Request {
    token: any;
    files: any;
  }
}
