import { Reducer } from "redux";

export const actionCreators = {
  login: (username, psw) => (dispatch, getState) => {
    fetch(`https://localhost:44339/api/users/authenticate`, {
      method: "POST",
      body: JSON.stringify({ username, password: psw }),
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        dispatch({ type: 'loggedIn', data})
      });
  },
  logout: () => (dispatch, getState) => {
    dispatch({ type: 'logout'})
  }
};

export const reducer: Reducer = (state, action) => {
  if (state === undefined) {
    return { account: null };
  }

  switch (action.type) {
    case 'loggedIn':
        return { account: action.data};
    case 'logout': 
        return {account: null};
    default:
      return state;
  }
};
