/**
 * Post the use Publick Key along with cookies to get its UUID, whoch is unique on the Private Key
 */
export const postSessionURL = '/api/session';

/**
 * Posts the bet transaction to be verified
 */
export const postBetURL = '/api/bet';

/**
 * Gets a user score verification
 */
export const getScoreURL = '/api/score/verify';

/**
 * Gets a user status: the score, if he has betted and iff he has an account
 */
export const getStatustURL = '/api/status';
