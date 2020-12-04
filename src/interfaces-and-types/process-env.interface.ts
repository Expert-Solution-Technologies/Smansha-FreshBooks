export { };
declare global {
    namespace NodeJS {
        export interface ProcessEnv {
            NODE_ENV: string;
            PORT: string;
            HOST: string;
            RABBITQUEUE_URL: string;
            RABBITQUEUE_USER_NAME: string;
            RABBITQUEUE_USER_PASS: string;
            RABBITQUEUE_SENDER: string;
            RABBITQUEUE_RECEIVER: string;
            AXIOS_TIMEOUT: string;
            SERVICE_CODE: string;
            QB_CLIENT_ID: string;
            QB_CLIENT_SECRET: string;
            QB_ENVIRONMENT: string;
            QB_REDIRECT_URI: string;
            QB_API_URL: string;
            SMAI_ONBOARDING_API_URL: string;
        }
    }
}
