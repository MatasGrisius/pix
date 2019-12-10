import { Reducer } from "redux";
import Swal from "sweetalert2";
import { history } from "./../index";

export const actionCreators = {
  fetchPictures: () => (dispatch, getState) => {
    fetch(`https://localhost:44339/api/Pictures`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        dispatch({ type: "fetchPictures", items: data });
      });
  },
  fetchPicture: id => (dispatch, getState) => {
    fetch(`https://localhost:44339/api/Pictures/` + id)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        dispatch({ type: "fetchPicture", item: data });
      });
  },
  addPicture: picture => (dispatch, getState) => {
    fetch(`https://localhost:44339/api/Pictures`, {
      method: "POST",
      body: JSON.stringify({
        ...picture,
        userId: getState().account.account.id,
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
        history.push("/photo/" + data.id);
      })
      .catch(err => {
        Swal.fire(
          "Oops...",
          err.message ? err.message : "Something went wrong!",
          "error"
        );
      });
  },
  editPicture: (id, picture) => (dispatch, getState) => {
    fetch(`https://localhost:44339/api/Pictures/` + id, {
      method: "PUT",
      body: JSON.stringify({
        ...picture,
        userId: getState().account.account.id,
        id,
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
        history.push("/photo/" + id);
      })
      .catch(err => {
        Swal.fire(
          "Oops...",
          err.message ? err.message : "Something went wrong!",
          "error"
        );
      });
  },
  deletePicture: id => (dispatch, getState) => {
    fetch(`https://localhost:44339/api/Pictures/` + id, {
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
        Swal.fire("Deleted", "Succesful operation", "success");
        history.push("/");
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
    return { pictures: [] };
  }

  switch (action.type) {
    case "fetchPictures":
      return { pictures: action.items };
    case "fetchPicture":
      return {
        pictures: [
          ...state.pictures.filter(e => e.id !== action.item.id),
          action.item,
        ],
      };
    default:
      return state;
  }
};
