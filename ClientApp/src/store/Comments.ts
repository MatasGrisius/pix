import { Reducer } from "redux";
import * as PictureStore from "./Pictures";
import Swal from "sweetalert2";
import { history } from "./../index";

export const actionCreators = {
  postComment: (pictureId, text) => (dispatch, getState) => {
    fetch(`http://namupc.tk:5000/api/Comments/`, {
      method: "POST",
      body: JSON.stringify({
        text,
        pictureId,
        userId: getState().account.account.id,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getState().account.account.token,
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        dispatch(PictureStore.actionCreators.fetchPicture(pictureId));
      });
  },
  deleteComment: (pictureId, id) => (dispatch, getState) => {
    fetch(`http://namupc.tk:5000/api/Comments/` + id, {
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
        dispatch(PictureStore.actionCreators.fetchPicture(pictureId));
      })
      .catch(err => {
        Swal.fire(
          "Oops...",
          err.message ? err.message : "Something went wrong!",
          "error"
        );
      });
  },
  editComment: (pictureId, comment, commentText) => (dispatch, getState) => {
    fetch(`http://namupc.tk:5000/api/Comments/` + comment.id, {
      method: "PUT",
      body: JSON.stringify({
        ...comment,
        userId: getState().account.account.id,
        text: commentText
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
        dispatch(PictureStore.actionCreators.fetchPicture(pictureId));
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
    return { comments: [] };
  }

  switch (action.type) {
    default:
      return state;
  }
};
