import { AsyncLocalStorage } from "node:async_hooks";
import {
  setSoftDeleteStorage,
  softDeleteStorage,
  type SoftDeleteContext
} from "./soft-delete";

setSoftDeleteStorage(new AsyncLocalStorage<SoftDeleteContext>());

export function withIncludeDeleted<T>(fn: () => Promise<T>): Promise<T> {
  const parent = softDeleteStorage.getStore();
  return softDeleteStorage.run({ ...parent, includeDeleted: true }, fn);
}

/** Internal bulk cleanup (method rebuild, edge-function sync) keeps hard DELETE. */
export function withHardDelete<T>(fn: () => Promise<T>): Promise<T> {
  const parent = softDeleteStorage.getStore();
  return softDeleteStorage.run({ ...parent, hardDelete: true }, fn);
}
