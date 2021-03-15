import React, { useReducer } from 'react'
import TreeDataContext from './context';

const initialState = {};
const {Provider} = TreeDataContext;
export function TreeDataProvider(props) {
    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case 'LOAD_TREE':
                return { treeData: action.payload };
            default:
                return state;
        }
    }, initialState);

    return (
        <Provider
            value={{
                state, dispatch
            }}
        >
            {props.children}
        </Provider>
    );
}