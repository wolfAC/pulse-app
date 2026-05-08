import { combineReducers } from "@reduxjs/toolkit";
import goalsReducer from "./slices/goals";
import healthReducer from "./slices/health";
import performanceReducer from "./slices/performance";
import financeReducer from "./slices/finance";
import appReducer from "./slices/app";

const combinedReducer = combineReducers({
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
