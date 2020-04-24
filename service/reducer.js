import {
  SET_ITEMS,
  REMOVE_ITEMS,
  SET_ID,
  SET_CONTACT,
  SET_CHANGE_COLOR,
  SET_ANIMATION,
  FETCH_PRODUCTS_BEGIN,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  SEARCH_ITEM
} from "./type";

const initialState = {
  result : [] ,
  id: 0,
  items: [],
  contacts: [],
  name: "",
  color: false,
  filter: [],
  filteredData: [],
  // anim:''
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_ITEMS:
      return {
        ...state,
        items: [...state.items, { text: action.payload, id: state.id }]
      };
    //REMOVE

    case SET_ID:
      return {
        ...state,
        id: state.id + 1
      };

    case REMOVE_ITEMS:
      return {
        ...state,
        items: [
          ...state.items.slice(0, action.payload),
          ...state.items.slice(action.payload + 1)
        ]
      };

    //contact

    case SET_CONTACT:
      return {
        ...state,
        name: action.payload
      };

    //changeColor

    case SET_CHANGE_COLOR:
      return {
        ...state,
        color: !state.color
      };

    //fetch
    case FETCH_PRODUCTS_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        contacts: action.payload,
        result: action.payload,
        filteredData:action.payload
      };

    case FETCH_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        contacts: [],
        result: []
      };

    //Search
    case SEARCH_ITEM:
      let searchFilterFunction = state.filteredData.filter(contact =>
        contact.login.toUpperCase().includes(action.payload.toUpperCase())
      );
      return {
        ...state,
        result: [...searchFilterFunction]
      };

    default:
      return state;
  }
}

export default reducer;
