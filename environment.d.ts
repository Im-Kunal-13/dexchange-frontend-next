declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NEXT_PUBLIC_DEXCHANGE_DEV_SERVER: string; 
        NEXT_PUBLIC_DEXCHANGE_DEV_PRODUCTION: string; 

      }
    }
  }