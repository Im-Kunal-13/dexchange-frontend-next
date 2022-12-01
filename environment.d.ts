declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NEXT_PUBLIC_DEXCHANGE_SERVER_PRODUCTION: string; 
        NEXT_PUBLIC_DEXCHANGE_SERVER_DEV: string; 

      }
    }
  }