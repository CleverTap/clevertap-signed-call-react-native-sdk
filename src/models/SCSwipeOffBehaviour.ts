/**
 * Enum representing the possible statuses of a Swipe Off Behavior during ongoing call
 */
export enum SCSwipeOffBehaviour {
  // Indicates the behavior where the call is ended when the user swipes off the app.
  EndCall = 'EndCall',

  // Indicates the behavior where the call persists even if the user swipes off the app.
  PersistCall = 'PersistCall',
}
