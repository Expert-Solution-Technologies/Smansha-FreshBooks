/**
 * Http Status Code Enum
 */
export enum HttpStatusCodes {
    badRequest = 400,
    notFound = 404,
    internalServerError = 500,
    unauthorized = 401,
    ok = 200
}

/**
 * Connection type
 */
export enum ConnectionType {
    sender = 'SENDER_QUEUE_CONNECTION',
    reciever = 'RECEIVER_QUEUE_CONNECTION'
}

export enum DateFormat {
    dateTimeIso = 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]',
    dateTime = 'YYYY-MM-DD HH:mm:ss',
    date = 'YYYY-MM-DD',
}

export enum TimeUnitKeys {
    minutes ='minutes',
    days = 'days',
    hours = 'hours',
    months = 'months'
}