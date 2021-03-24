import {
    REQ_LOGIN,
    REQ_LOGIN_FAILED,
    REQ_LOGIN_SUCCESS,
    REQ_REGISTER,
    REQ_REGISTER_SUCCESS,
    REQ_REGISTER_FAILED,
    STORE_ACTIVE_ROOMS,
    CONNECT_SOCKET,
    UPDATE_ACTIVE_ROOMS,
    ADD_ACTIVE_ROOM,
    REQ_USER_DATA,
    REQ_USER_DATA_SUCCESS,
    REQ_USER_DATA_FAILED,
} from '../actionTypes';

const initialState = {
    socketManager: null,
    isRequestRegister: false,
    isRequestLogin: false,
    isRequsetUserData: false,
    errResponseRegister: null,
    errResponseLogin: null,
    errResponseGetUserData: null,
    user: {
        username: '',
        activeChats: [],
        friends: [],
    },
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case REQ_REGISTER:
            return {
                ...state,
                isRequestRegister: true,
                errResponseRegister: null,
            };
        case REQ_REGISTER_SUCCESS:
            return {
                ...state,
                isRequestRegister: false,
            };
        case REQ_REGISTER_FAILED:
            return {
                ...state,
                isRequestRegister: false,
                errResponseRegister: action.errResponse,
            };
        case REQ_LOGIN: {
            return {
                ...state,
                isRequestLogin: true,
                errResponseLogin: null,
            };
        }
        case REQ_LOGIN_SUCCESS:
            return {
                ...state,
                isRequestLogin: false,
                user: action.data,
            };
        case REQ_LOGIN_FAILED:
            return {
                ...state,
                isRequestLogin: false,
                errResponseLogin: action.errResponse,
            };
        case STORE_ACTIVE_ROOMS: {
            const updatedUser = { ...state.user };
            const activeChats = action.activeChats;
            activeChats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            updatedUser.activeChats = activeChats;
            return {
                ...state,
                user: updatedUser,
            };
        }
        case UPDATE_ACTIVE_ROOMS: {
            const user = { ...state.user };
            const activeChats = [...user.activeChats];
            const newChat = action.activeChat;
            let isNew = true;
            for (const [i, chat] of activeChats.entries()) {
                if (chat._id.toString() === newChat._id.toString()) {
                    activeChats[i] = newChat;
                    isNew = false;
                    break;
                }
            }
            if (isNew) {
                activeChats.push(newChat);
            }
            user.activeChats = activeChats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            return {
                ...state,
                user,
            };
        }
        case ADD_ACTIVE_ROOM: {
            const user = { ...state.user };
            user.activeChats = [action.activeChat, ...user.activeChats];
            return {
                ...state,
                user,
            };
        }
        case CONNECT_SOCKET: {
            return {
                ...state,
                socketManager: action.socketManager,
            };
        }
        case REQ_USER_DATA:
            return {
                ...state,
                isRequsetUserData: true,
                errResponseGetUserData: null,
            };
        case REQ_USER_DATA_SUCCESS:
            const user = { ...action.data };
            user.activeChats = user.activeChats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            return {
                ...state,
                isRequsetUserData: false,
                user,
            };
        case REQ_USER_DATA_FAILED:
            return {
                ...state,
                isRequsetUserData: false,
                errResponseGetUserData: action.errResponse,
            };
        default:
            return state;
    }
};

export { userReducer };
