import { combineReducers } from "@reduxjs/toolkit";
import goalsReducer from "./slices/goals";
import healthReducer from "./slices/health";
import performanceReducer from "./slices/performance";
import financeReducer from "./slices/finance";

const appReducer = combineReducers({
  goals: goalsReducer,
  health: healthReducer,
  performance: performanceReducer,
  finance: financeReducer,
});

export type AppState = ReturnType<typeof appReducer>;

const rootReducer = (state: AppState | undefined, action: any): AppState => {
  if (action.type === "IMPORT_STATE") {
    return action.payload;
  }
  return appReducer(state, action);
};

export default rootReducer;
