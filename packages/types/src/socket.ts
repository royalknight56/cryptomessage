export interface TopicPayload<T> {
  topic: string;
  payload: T;
  success: boolean;
}

export interface ActionPayload<T> {
  action: string;
  payload: T;
  uid: string;
}
