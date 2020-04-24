import {
  SET_ITEMS,
  REMOVE_ITEMS,
  SET_ID,
  SET_CONTACT,
  SET_CHANGE_COLOR,
  FETCH_PRODUCTS_BEGIN,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  SEARCH_ITEM
} from "./type";

//fetch
export const fetchProducts = () => {
  return dispatch => {
    dispatch(fetchProductsBegin());
    return (
      fetch("https://api.github.com/users")
        // .then(handleErrors)
        .then(res => res.json())
        .then(json => {
          dispatch(fetchProductsSuccess(json));
        })
        .catch(error => dispatch(fetchProductsFailure(error)))
    );
  };
};

const fetchProductsBegin = () => ({
  type: FETCH_PRODUCTS_BEGIN
});

const fetchProductsSuccess = products => {
  return {
    type: FETCH_PRODUCTS_SUCCESS,
    payload: products
  };
};

const fetchProductsFailure = error => ({
  type: FETCH_PRODUCTS_FAILURE,
  payload: error
});

//setItem
const setItemsAction = input => {
  return {
    type: SET_ITEMS,
    payload: input
  };
};

export const setItems = input => {
  return setItemsAction(input);
};

//REMOVE
const setItemsRemove = index => {
  return {
    type: REMOVE_ITEMS,
    payload: index
  };
};

export const setDelete = index => {
  return setItemsRemove(index);
};

export const setItemsID = () => {
  return {
    type: SET_ID
  };
};
export const setID = () => {
  return setItemsID();
};
//contact
const setItemsContact = name => {
  return {
    type: SET_CONTACT,
    payload: name
  };
};

export const setContact = name => {
  return setItemsContact(name);
};

//Color
const setchangeColorAction = () => {
  return {
    type: SET_CHANGE_COLOR
  };
};

export const setchangeColor = () => {
  return setchangeColorAction();
};

//Search
const setSearchAction = text => {
  return {
    type: SEARCH_ITEM,
    payload: text
  };
};

export const setSearch = text => {
  return setSearchAction(text);
};

//Animation
// const setItemsAnimation = () => {
//   return {
//     type:SET_ANIMATION,

//   };
// };

// export const setAnimation = () => {
//     return setItemsAnimation();
//   };
