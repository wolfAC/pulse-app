import { combineReducers } from "@reduxjs/toolkit";
import appReducer from "./slices/app";
import authReducer from "./slices/auth";
import financeReducer from "./slices/finance";
import goalsReducer from "./slices/goals";
import healthReducer from "./slices/health";
import performanceReducer from "./slices/performance";

const combinedReducer = combineReducers({
  auth: authReducer,
  app: appReducer,
  goals: goalsReducer,
  health: healthReducer,
  performance: performanceReducer,
  finance: financeReducer,
});

export type AppState = ReturnType<typeof combinedReducer>;

const rootReducer = (state: AppState | undefined, action: any): AppState => {
  if (action.type === "IMPORT_STATE") {
    return action.payload;
  }
  return combinedReducer(state, action);
};

export default rootReducer;
