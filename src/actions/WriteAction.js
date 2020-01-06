import {ACTIONS} from './types';
import {URLS, BASE_URL, HTTP_TIMEOUT} from '../Constants';
import axios from 'axios';
import crashlytics from '@react-native-firebase/crashlytics';


// Bullshit to do in evey file ->
const httpClient = axios.create();

httpClient.defaults.timeout = HTTP_TIMEOUT;
httpClient.defaults.baseURL = BASE_URL;

export const setAuthToken = () => {
  return (dispatch, getState) => {
    const state = getState();
    httpClient.defaults.headers.common['Authorization'] = state.login.authtoken;
    dispatch({type:null})
  }
}
// till here

export const getMyArticles = (myArticlesLength, reload) => {
  if (myArticlesLength===0 || reload){
    return (dispatch) => {
      dispatch({type:ACTIONS.WRITE_LOADING});
      httpClient.get(URLS.myarticles).then(
        (response)=>{
          dispatch({type:ACTIONS.GET_MY_ARTICLES,
          payload:{response:response.data.response, all_categories:response.data.all_categories}})
        }
      ).catch(e=>crashlytics().log("WriteAction LINE 30"+e.toString()))
    }
  }
  else{
    return {type:null}
  }
  
  
}

export const setContents = (contents, topic, category) => {
  return {type:ACTIONS.SET_CONTENTS, payload:{contents, topic, category}}
}

export const setImage = (image) => {
  return {type:ACTIONS.SET_IMAGE, payload:image}
}

export const uploadImage = async (resourceData, file) => {
  return new Promise((resolver, rejecter) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = () => {
      if (xhr.status < 400) {
        resolver(true)
      } else {
        const error = new Error(xhr.response);
        rejecter(error)
      }
    };
    xhr.onerror = (error) => {
      rejecter(error)
    };

    xhr.open('PUT', resourceData.uploadUrl);
    xhr.setRequestHeader('Content-Type', resourceData.contentType);
    xhr.send({ uri: file });
  })
}

export const publishArticle = (article) => {
  return (dispatch) => {
    dispatch({type:ACTIONS.WRITE_LOADING})

    if (article.image){
      httpClient.get(URLS.imageupload).then((response)=>{
        const preSignedURL = response.data.url
        const pathToImage = article.image
        uploadImage({contentType: "image/jpeg", uploadUrl: preSignedURL}, pathToImage)        
          .then(() => {
            article.image = response.data.key
            httpClient.post(URLS.publish, article).then(
              () => {       
                dispatch({type:ACTIONS.PUBLISH_SUCCESS});
              }
            );
          }).catch(e=>crashlytics().log("WriteAction LINE 86"+e.toString()))
        }).catch(e=>crashlytics().log("WriteAction LINE 87"+e.toString()))
      }
    else{
      httpClient.post(URLS.publish, article).then(
        () => {       
          dispatch({type:ACTIONS.PUBLISH_SUCCESS});
        }
      ).catch(e=>crashlytics().log("WriteAction LINE 94"+e.toString()))
    }
    };
  }


export const clearPublish = () => {
  return {type:ACTIONS.CLEAR_WRITE}
}

export const showAlert = (alertVisible, alertMessage) => {
  return {type: ACTIONS.WRITE_SHOW_ALERT, payload:{alertVisible, alertMessage}}
}

export const setDraft = () => {
  return {type: ACTIONS.WRITE_SET_DRAFT}
}