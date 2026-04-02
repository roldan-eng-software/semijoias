export const logger = {
  error: (message: string, error?: any) => {
    const isDev = process.env.NODE_ENV === 'development';
    console.error(`[ERROR] ${message}`);
    if (isDev && error) {
      console.error(error);
    }
  },
  info: (message: string) => {
    console.log(`[INFO] ${message}`);
  }
};
