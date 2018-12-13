import localStorage from "localStorage";

const saveObject = (key, object) => {
  localStorage.setItem(key, JSON.stringify(object));
};

const getObject = key => JSON.parse(localStorage.getItem(key));

export { saveObject, getObject };
