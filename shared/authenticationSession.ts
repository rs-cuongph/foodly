import { Session } from "next-auth";
import { STORAGE_KEYS } from "./constants";

class AuthenticationSessionStorage {
  private storage: Record<string, any>;
  private processInstance?: Promise<unknown>;
  private processResolve?: (value: unknown) => void;
  constructor() {
    this.storage = {};
  }

  initialProcessing() {
    return this.processInstance;
  }

  initial() {
    if (this.processInstance) {
      return this.processInstance;
    }
    this.processInstance = new Promise((resolve) => {
      this.processResolve = resolve;
    });
    return this.processInstance;
  }

  private endProcessed() {
    if (this.processResolve) {
      this.processResolve(true);
      this.processResolve = undefined;
      this.processInstance = undefined;
    }
  }

  getAuthentication() {
    return this.storage[STORAGE_KEYS.AUTHENTICATION];
  }

  setAuthentication(data: Session | null | undefined) {
    if (data?.user) {
      this.storage[STORAGE_KEYS.AUTHENTICATION] = data?.user;
    }
    this.endProcessed();
  }

  setInitialAuthentication(data: Session | null | undefined) {
    if (data?.user) {
      this.storage[STORAGE_KEYS.AUTHENTICATION] = data?.user;
    }
  }
  clearAuthentication() {
    delete this.storage[STORAGE_KEYS.AUTHENTICATION];
  }

  setItem(key: string, data: any) {
    this.storage[key] = data;
  }

  getItem(key: string) {
    return this.storage[key];
  }

  clearItem(key: string) {
    delete this.storage[key];
  }
}

export default new AuthenticationSessionStorage();
