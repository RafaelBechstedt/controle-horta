// Error with an attached HTTP status, thrown by services and translated by the
// central error handler into a JSON response.
export class AppError extends Error {
    constructor(status, message) {
        super(message);
        this.name = 'AppError';
        this.status = status;
    }
}
