import { Reducer } from "redux";
import Swal from "sweetalert2";
import { history } from "../index";

export const actionCreators = {
  fetchTags: () => (dispatch, getState) => {
    fetch(`http://namupc.tk:5000/api/Tags`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        dispatch({ type: "fetchTags", items: data });
      });
  },
  renameTag: (id, name) => (dispatch, getState) => {
    fetch(`http://namupc.tk:5000/api/Tags/` + id, {
      method: "PUT",
      body: JSON.stringify({
        name,
        id
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getState().account.account.token,
      },
    })
      .then(async function(response: any) {
        console.log(response);
        if (!response.ok) {
          throw Error((await response).message);
        }
        return response;
      })
      .then(data => {
        dispatch(actionCreators.fetchTags());
        Swal.fire("Renamed", "Succesful operation", "success");
      })
      .catch(err => {
        Swal.fire(
          "Oops...",
          err.message ? err.message : "Something went wrong!",
          "error"
        );
      });
  },
  deleteTag: id => (dispatch, getState) => {
    fetch(`http://namupc.tk:5000/api/Tags/` + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getState().account.account.token,
      },
    })
      .then(async function(response: any) {
        console.log(response);
        if (!response.ok) {
          throw Error((await response).message);
        }
        return response;
      })
      .then(data => {
        dispatch(actionCreators.fetchTags());
        Swal.fire("Deleted", "Succesful operation", "success");
      })
      .catch(err => {
        Swal.fire(
          "Oops...",
          err.message ? err.message : "Something went wrong!",
          "error"
        );
      });
  },
  addTag: name => (dispatch, getState) => {
    fetch(`http://namupc.tk:5000/api/Tags`, {
      method: "POST",
      body: JSON.stringify({
        name,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getState().account.account.token,
      },
    })
      .then(async function(response: any) {
        if (!response.ok) {
          throw Error((await response.json()).message);
        }
        return response.json();
      })
      .then(data => {
        dispatch(actionCreators.fetchTags());
        Swal.fire("Created", "Succesful operation", "success");
      })
      .catch(err => {
        Swal.fire(
          "Oops...",
          err.message ? err.message : "Something went wrong!",
          "error"
        );
      });
  },
};

export const reducer: Reducer = (state, action) => {
  if (state === undefined) {
    return [];
  }

  switch (action.type) {
    case "fetchTags":
      return action.items;
    default:
      return state;
  }
};
