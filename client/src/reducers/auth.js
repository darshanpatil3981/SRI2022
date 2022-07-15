export const authReducer = (
    state = {name: "Ryan", role: "Seller"}, 
    action
    ) => {
    // each action has type and payload
    // e.g.{ type: 'LOGGED_IN_USER', payload: {name: 'Ryan', role: 'Seller'} }  
    switch (action.type) {
      case "LOGGED_IN_USER":
        return {...state, ...action.payload};
      case "LOGOUT":
        return action.payload;
      default:
        return state;
    }
}
