import React, { useReducer, useEffect } from 'react';
import fetchServerData from './actionCreators/fetchServerData';
import fetchAutoCompleteData from './actionCreators/fetchAutoCompleteData';
import executeRequest from './actionCreators/executeRequest';
import reducer, {
    initialState,
    SELECT_SERVER,
    SELECT_METHOD,
    ADD_SERVER,
    DELETE_SERVER,
    EDIT_REQUEST,
    ADD_METADATA,
    DELETE_METADATA,
} from './reducer';

export const RecessContext = React.createContext();

export function RecessContextManager({ children }) {
    const [state, dispatch] = useReducer(reducer, {
        ...initialState,
        ...JSON.parse(localStorage.getItem('recessState')),
    });

    useEffect(
        () => {
            fetchServerData(state.selectedServer, dispatch);
        },
        [state.selectedServer]
    );

    useEffect(
        () => {
            fetchAutoCompleteData({
                name: state.selectedServer.name,
                port: state.selectedServer.port,
                serviceName: state.service.serviceName,
                methodName: state.method.name,
                dispatch,
            });
        },
        [
            state.selectedServer.name,
            state.selectedServer.port,
            state.service.serviceName,
            state.method.name,
        ]
    );

    useEffect(
        () => {
            localStorage.setItem(
                'recessState',
                JSON.stringify({
                    ...state,
                    // don't store data fetched from back end
                    serverData: [],
                })
            );
        },
        [state]
    );

    const value = {
        serverData: state.serverData,
        isLoadingServerData: state.isLoadingServerData,
        serverDataError: state.serverDataError,
        servers: state.servers,
        selectedServer: state.selectedServer,
        selectServer: server => dispatch({ type: SELECT_SERVER, server }),
        selectedService: state.service,
        selectedMethod: state.method,
        selectMethod: (service, method) => dispatch({ type: SELECT_METHOD, service, method }),
        reloadServerData: () => fetchServerData(state.selectedServer, dispatch),
        addServer: ({ name, port }) => dispatch({ type: ADD_SERVER, name, port }),
        deleteServer: i => dispatch({ type: DELETE_SERVER, i }),
        requestText: state.requestText,
        response: state.response,
        setRequestText: requestText => dispatch({ type: EDIT_REQUEST, requestText }),
        executeRequest: () => executeRequest(state, dispatch),
        metadata: state.metadata,
        addMetadata: ({ key, value }) => dispatch({ type: ADD_METADATA, key, value }),
        deleteMetadata: ({ key }) => dispatch({ type: DELETE_METADATA, key }),
    };

    console.log(value);

    return <RecessContext.Provider value={value}>{children}</RecessContext.Provider>;
}
