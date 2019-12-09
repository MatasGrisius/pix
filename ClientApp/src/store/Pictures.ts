import { Reducer } from 'redux';

export const actionCreators = {
    fetchPictures: () =>  (dispatch, getState) => {
        fetch(`https://localhost:44339/api/Pictures`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                dispatch({ type: 'fetchPictures', items: data})
            })
    },
    fetchPicture: (id) =>  (dispatch, getState) => {
        fetch(`https://localhost:44339/api/Pictures/` + id)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                dispatch({ type: 'fetchPicture', item: data})
            })
    },
    addPicture: (picture) =>  (dispatch, getState) => {
        fetch(`https://localhost:44339/api/Pictures`, {
            method: "POST",
            body: JSON.stringify({...picture, userId: getState().account.account.id}),
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + getState().account.account.token
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
    },
    editPicture: (id, picture) =>  (dispatch, getState) => {
        fetch(`https://localhost:44339/api/Pictures/` + id, {
            method: "PUT",
            body: JSON.stringify({...picture, userId: getState().account.account.id}),
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + getState().account.account.token
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
    },
    deletePicture: (id) =>  (dispatch, getState) => {
        fetch(`https://localhost:44339/api/Pictures/` + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + getState().account.account.token
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
    },
};

export const reducer: Reducer = (state, action) => {
    if (state === undefined) {
        return { pictures: [] };
    }

    switch (action.type) {
        case 'fetchPictures':
            return { pictures: action.items };
        case 'fetchPicture':
            return { pictures: [...state.pictures.filter(e => e.id !== action.item.id), action.item] };
        default:
            return state;
    }
};
