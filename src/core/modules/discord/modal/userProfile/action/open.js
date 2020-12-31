// if (!userId) return;
// // @todo Use Discord module for this after it's set up.
// getModule('getUser').getUser(userId)
//   .then(() => getModule('dirtyDispatch').wait(
//     () => getModule('dirtyDispatch').dispatch({ type: constants.ActionTypes.USER_PROFILE_MODAL_OPEN, userId })))
//   .catch(() => vizality.api.notices.sendToast(`open-user-profile-${(Math.random().toString(36) + Date.now()).substring(2, 6)}`, {
//     header: 'User Not Found',
//     type: 'User Not Found',
//     content: 'That user was unable to be located.',
//     icon: 'PersonRemove'
//   }));
