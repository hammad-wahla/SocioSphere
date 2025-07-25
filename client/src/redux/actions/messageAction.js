import { GLOBALTYPES, DeleteData } from '../actions/globalTypes'
import { postDataAPI, getDataAPI, deleteDataAPI, patchDataAPI } from '../../utils/fetchData'

export const MESS_TYPES = {
    ADD_USER: 'ADD_USER',
    ADD_MESSAGE: 'ADD_MESSAGE',
    GET_CONVERSATIONS: 'GET_CONVERSATIONS',
    GET_MESSAGES: 'GET_MESSAGES',
    UPDATE_MESSAGES: 'UPDATE_MESSAGES',
    DELETE_MESSAGES: 'DELETE_MESSAGES',
    DELETE_CONVERSATION: 'DELETE_CONVERSATION',
    CHECK_ONLINE_OFFLINE: 'CHECK_ONLINE_OFFLINE',
    UPDATE_UNREAD_COUNT: 'UPDATE_UNREAD_COUNT',
    SET_UNREAD_COUNTS: 'SET_UNREAD_COUNTS',
    CLEAR_UNREAD_COUNT: 'CLEAR_UNREAD_COUNT',
    UPDATE_MESSAGE_READ_STATUS: 'UPDATE_MESSAGE_READ_STATUS'
}



export const addMessage = ({msg, auth, socket}) => async (dispatch) =>{
    dispatch({type: MESS_TYPES.ADD_MESSAGE, payload: msg})

    const { _id, avatar, fullname, username } = auth.user
    socket.emit('addMessage', {...msg, user: { _id, avatar, fullname, username } })
    
    try {
        await postDataAPI('message', msg, auth.token)
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const getConversations = ({auth, page = 1}) => async (dispatch) => {
    try {
        const res = await getDataAPI(`conversations?limit=${page * 9}`, auth.token)
        
        let newArr = [];
        res.data.conversations.forEach(item => {
            item.recipients.forEach(cv => {
                if(cv._id !== auth.user._id){
                    newArr.push({...cv, text: item.text, media: item.media, call: item.call})
                }
            })
        })

        dispatch({
            type: MESS_TYPES.GET_CONVERSATIONS, 
            payload: {newArr, result: res.data.result}
        })

    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const getMessages = ({auth, id, page = 1}) => async (dispatch) => {
    try {
        const res = await getDataAPI(`message/${id}?limit=${page * 9}`, auth.token)
        const newData = {...res.data, messages: res.data.messages.reverse()}

        dispatch({type: MESS_TYPES.GET_MESSAGES, payload: {...newData, _id: id, page}})
        
        // Clear unread count for this conversation
        dispatch({type: MESS_TYPES.CLEAR_UNREAD_COUNT, payload: id})
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const loadMoreMessages = ({auth, id, page = 1}) => async (dispatch) => {
    try {
        const res = await getDataAPI(`message/${id}?limit=${page * 9}`, auth.token)
        const newData = {...res.data, messages: res.data.messages.reverse()}

        dispatch({type: MESS_TYPES.UPDATE_MESSAGES, payload: {...newData, _id: id, page}})
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const deleteMessages = ({msg, data, auth}) => async (dispatch) => {
    const newData = DeleteData(data, msg._id)
    dispatch({type: MESS_TYPES.DELETE_MESSAGES, payload: {newData, _id: msg.recipient}})
    try {
        await deleteDataAPI(`message/${msg._id}`, auth.token)
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const deleteConversation = ({auth, id}) => async (dispatch) => {
    dispatch({type: MESS_TYPES.DELETE_CONVERSATION, payload: id})
    try {
        await deleteDataAPI(`conversation/${id}`, auth.token)
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const getUnreadCounts = ({auth}) => async (dispatch) => {
    try {
        const res = await getDataAPI('unread-counts', auth.token)
        dispatch({
            type: MESS_TYPES.SET_UNREAD_COUNTS, 
            payload: res.data
        })
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const markMessagesAsRead = ({auth, id, socket}) => async (dispatch) => {
    try {
        dispatch({type: MESS_TYPES.CLEAR_UNREAD_COUNT, payload: id})
        
        await patchDataAPI(`mark-read/${id}`, {}, auth.token)
        
        // Notify sender that messages were read
        socket.emit('markMessagesRead', {
            sender: id,
            reader: auth.user._id,
            readAt: new Date()
        })
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}