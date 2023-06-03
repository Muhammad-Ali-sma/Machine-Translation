import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AuthSlice from '../Slices/AuthSlice'
import GlobalSlice from '../Slices/GlobalSlice'
import NotificationSlice from '../Slices/NotificationSlice'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
  whitelist: ['auth']
}

const rootReducer = combineReducers({
  auth: AuthSlice,
  global: GlobalSlice,
  notification: NotificationSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk]
})

export const persistor = persistStore(store)