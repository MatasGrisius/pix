import { Reducer } from "redux";
import Swal from "sweetalert2";
import { history } from "./../index";

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
      .then(async function(response: any) {
        if (!response.ok) {
            throw Error((await response.json()).message);
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        dispatch({ type: "loggedIn", data });
        history.push("/");
      })
      .catch(err => {
        Swal.fire('Oops...', err.message? err.message : 'Something went wrong!', 'error')
      });
  },
  logout: () => (dispatch, getState) => {
    dispatch({ type: "logout" });
  },
};

export const reducer: Reducer = (state, action) => {
  if (state === undefined) {
    return { account: null };
  }

  switch (action.type) {
    case "loggedIn":
      return { account: action.data };
    case "logout":
      return { account: null };
    default:
      return state;
  }
};
