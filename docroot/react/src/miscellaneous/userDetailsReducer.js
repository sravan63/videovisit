const userDetailsReducer = (state = {}, action) => {
	switch(action.type) {
	    case 'ADD_USER_DETAILS':
	    	state.userDetails = action.data;
	      return state;
	    default:
	      return state;
	}
}
export default userDetailsReducer;