/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as attorneyQuestions from "../attorneyQuestions.js";
import type * as crons from "../crons.js";
import type * as documentAnalysis from "../documentAnalysis.js";
import type * as documentExtraction from "../documentExtraction.js";
import type * as documentGeneration from "../documentGeneration.js";
import type * as documentGenerationMutations from "../documentGenerationMutations.js";
import type * as e2bClient from "../e2bClient.js";
import type * as estatePlanning from "../estatePlanning.js";
import type * as extractedData from "../extractedData.js";
import type * as familyContacts from "../familyContacts.js";
import type * as gapAnalysis from "../gapAnalysis.js";
import type * as gapAnalysisOrchestration from "../gapAnalysisOrchestration.js";
import type * as gapAnalysisProgress from "../gapAnalysisProgress.js";
import type * as gapAnalysisQueries from "../gapAnalysisQueries.js";
import type * as guidedIntake from "../guidedIntake.js";
import type * as mutations from "../mutations.js";
import type * as notificationActions from "../notificationActions.js";
import type * as notifications from "../notifications.js";
import type * as preparationTasks from "../preparationTasks.js";
import type * as queries from "../queries.js";
import type * as reminders from "../reminders.js";
import type * as runAgent from "../runAgent.js";
import type * as skillsBundle from "../skillsBundle.js";
import type * as stateSpecificAnalysis from "../stateSpecificAnalysis.js";
import type * as uploadedDocuments from "../uploadedDocuments.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  attorneyQuestions: typeof attorneyQuestions;
  crons: typeof crons;
  documentAnalysis: typeof documentAnalysis;
  documentExtraction: typeof documentExtraction;
  documentGeneration: typeof documentGeneration;
  documentGenerationMutations: typeof documentGenerationMutations;
  e2bClient: typeof e2bClient;
  estatePlanning: typeof estatePlanning;
  extractedData: typeof extractedData;
  familyContacts: typeof familyContacts;
  gapAnalysis: typeof gapAnalysis;
  gapAnalysisOrchestration: typeof gapAnalysisOrchestration;
  gapAnalysisProgress: typeof gapAnalysisProgress;
  gapAnalysisQueries: typeof gapAnalysisQueries;
  guidedIntake: typeof guidedIntake;
  mutations: typeof mutations;
  notificationActions: typeof notificationActions;
  notifications: typeof notifications;
  preparationTasks: typeof preparationTasks;
  queries: typeof queries;
  reminders: typeof reminders;
  runAgent: typeof runAgent;
  skillsBundle: typeof skillsBundle;
  stateSpecificAnalysis: typeof stateSpecificAnalysis;
  uploadedDocuments: typeof uploadedDocuments;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
