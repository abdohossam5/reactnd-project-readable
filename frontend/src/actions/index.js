export const RECEIVED_CATEGORIES = 'RECEIVED_CATEGORIES';
export const recievedCategories = (data) => ({
  type: RECEIVED_CATEGORIES,
  data
});

export const FETCH_CATEGORIES = 'FETCH_CATEGORIES';
export const fetchCategories = () => ({
  type: FETCH_CATEGORIES
});