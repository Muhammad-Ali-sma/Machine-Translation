import axios from 'axios'
import { toggleLogin } from '../Redux/Slices/AuthSlice';
import { setNotification } from '../Redux/Slices/NotificationSlice';
import { store } from "../Redux/store/Store";

const handleError = (error) => {
  if (error.response.status === 401) {
    store.dispatch(toggleLogin('Logout'));
  } else if (error?.response?.status === 400) {
    store.dispatch(setNotification({ message: error?.response?.data.validationErrors?.Error || error?.response?.data.validationErrors?.sourceLanguageContent || "Something went wrong!", type: 'danger' }));
  } else if (error?.response?.status === 403) {
    store.dispatch(toggleLogin('403'));
  } else {
    if (error?.code === "ERR_NETWORK") {
      store.dispatch(setNotification({ message: "Request timed out. Services might be down!", type: 'danger' }));
    } else {
      store.dispatch(setNotification({ message: "Something went wrong", type: 'danger' }));
    }
  }
}

const Get = async (host, showMsg = true) => {
  return axios
    .get(host)
    .then(({ data }) => {
      if (data.data?.message !== null && showMsg) {
        store.dispatch(setNotification({ message: data.data?.message, type: data.data?.status === "failure" ? 'danger' : 'success' }));
      }
      return data
    })
    .catch(async (error) => {
      console.log('error in axios Get', error);
      if (!error.response) {
        // network error
        this.errorStatus = 'Error: Network Error. Check if backend services are up and running';
      } else {
        handleError(error);
        throw Error("Network Error");
        // return {
        //   success: false,
        //   error,
        // }
      }
    })
}

const PostAuth = async (
  host,
  data,
  showMsg = true,
  config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
    },
  }
) => {
  return axios
    .post(host, data, config)
    .then((data) => {
      if (data.data?.message !== null) {
        if (showMsg) {
          store.dispatch(setNotification({ message: data.data?.message, type: data.data?.status === "failure" ? 'danger' : 'success' }));
        }
      }
      else {
        store.dispatch(setNotification({ message: data.data?.validationErrors?.Error || "Something went wrong!", type: 'danger' }));
      }
      return data
    })
    .catch((error) => {
      console.log('error in axios PostAuth', error);
      if (!error.response) {
        // network error
        this.errorStatus = 'Error: Network Error. Check if backend services are up and running';
      } else {
        handleError(error);
        throw Error("Network Error");
        // return {
        //   success: false,
        //   error,
        // }
      }
    })
}

const Post = async (
  host,
  data,
  showMsg = true,
  config = {
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  }
) => {
  return axios
    .post(host, data, config)
    .then((data) => {
      if (data.data?.message !== null) {
        if (showMsg) {
          store.dispatch(setNotification({ message: data.data?.message, type: data.data?.status === "failure" ? 'danger' : 'success' }));
        }
      }
      else {
        store.dispatch(setNotification({ message: data.data?.validationErrors?.Error || "Something went wrong!", type: 'danger' }));
      }
      return data
    })
    .catch((error) => {
      console.log('error in axios Post',);
      if (!error.response) {
        // network error
        this.errorStatus = 'Error: Network Error. Check if backend services are up and running';
      } else {
        handleError(error);
        throw Error("Network Error");
        // return {
        //   success: false,
        //   error,
        // }
      }
    })
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { Get, Post, PostAuth }
