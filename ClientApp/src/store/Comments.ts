import { Reducer } from 'redux';
import * as PictureStore from './Pictures';

export const actionCreators = {
    postComment: (pictureId, text) =>  (dispatch, getState) => {
        fetch(`https://localhost:44339/api/Comments/`, {
            method: 'POST',
            body: JSON.stringify({text, pictureId, userId: getState().account.account.id}),
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + getState().account.account.token
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                dispatch(PictureStore.actionCreators.fetchPicture(pictureId));
            })
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
