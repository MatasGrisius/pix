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
};

export const reducer: Reducer = (state, action) => {
    if (state === undefined) {
        return { pictures: [] };
    }

    switch (action.type) {
        case 'fetchPictures':
            return { pictures: action.items };
        default:
            return state;
    }
};
