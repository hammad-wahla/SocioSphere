import { MESS_TYPES } from '../actions/messageAction'
import { EditData, DeleteData } from '../actions/globalTypes'

const initialState = {
    users: [],
    resultUsers: 0,
    data: [],
    firstLoad: false,
    unreadCounts: {}, // { userId: count }
    totalUnread: 0
}

const messageReducer = (state = initialState, action) => {
    switch (action.type){
        case MESS_TYPES.ADD_USER:
            if(state.users.every(item => item._id !== action.payload._id)){
                return {
                    ...state,
                    users: [action.payload, ...state.users]
                };
            }
            return state;
        case MESS_TYPES.ADD_MESSAGE:
            return {
                ...state,
                data: state.data.map(item => 
                    item._id === action.payload.recipient || item._id === action.payload.sender 
                    ? {
                        ...item,
                        messages: [...item.messages, action.payload],
                        result: item.result + 1
                    }
                    : item
                ),
                users: state.users.map(user => 
                    user._id === action.payload.recipient || user._id === action.payload.sender
                    ? {
                        ...user, 
                        text: action.payload.text, 
                        media: action.payload.media,
                        call: action.payload.call
                    }
                    : user
                )
            };
        case MESS_TYPES.GET_CONVERSATIONS:
            return {
                ...state,
                users: action.payload.newArr,
                resultUsers: action.payload.result,
                firstLoad: true
            };
        case MESS_TYPES.GET_MESSAGES:
            return {
                ...state,
                data: [...state.data, action.payload]
            };
        case MESS_TYPES.UPDATE_MESSAGES:
            return {
                ...state,
                data: EditData(state.data, action.payload._id, action.payload)
            };
        case MESS_TYPES.DELETE_MESSAGES:
            return {
                ...state,
                data: state.data.map(item => 
                    item._id === action.payload._id
                    ? {...item, messages: action.payload.newData}
                    : item
                )
            };
        case MESS_TYPES.DELETE_CONVERSATION:
            return {
                ...state,
                users: DeleteData(state.users, action.payload),
                data: DeleteData(state.data, action.payload)
            };
        case MESS_TYPES.CHECK_ONLINE_OFFLINE:
            return {
                ...state,
                users: state.users.map(user => 
                    action.payload.includes(user._id)
                    ? {...user, online: true}
                    : {...user, online: false}
                )
            };
        case MESS_TYPES.UPDATE_UNREAD_COUNT:
            const newUnreadCounts = { ...state.unreadCounts };
            if (action.payload.increment) {
                newUnreadCounts[action.payload.sender] = (newUnreadCounts[action.payload.sender] || 0) + 1;
            } else {
                delete newUnreadCounts[action.payload.sender];
            }
            return {
                ...state,
                unreadCounts: newUnreadCounts,
                totalUnread: Object.keys(newUnreadCounts).length
            };
        case MESS_TYPES.SET_UNREAD_COUNTS:
            const counts = {};
            action.payload.unreadCounts.forEach(item => {
                counts[item.userId] = item.count;
            });
            return {
                ...state,
                unreadCounts: counts,
                totalUnread: action.payload.totalUnread
            };
        case MESS_TYPES.CLEAR_UNREAD_COUNT:
            const updatedCounts = { ...state.unreadCounts };
            delete updatedCounts[action.payload];
            return {
                ...state,
                unreadCounts: updatedCounts,
                totalUnread: Object.keys(updatedCounts).length
            };
        case MESS_TYPES.UPDATE_MESSAGE_READ_STATUS:
            return {
                ...state,
                data: state.data.map(item => 
                    item._id === action.payload.userId
                    ? {
                        ...item,
                        messages: item.messages.map(msg => 
                            msg.recipient === action.payload.reader && !msg.isRead
                            ? {...msg, isRead: true, readAt: action.payload.readAt}
                            : msg
                        )
                    }
                    : item
                )
            };
        default:
            return state;
    }
}

export default messageReducer;