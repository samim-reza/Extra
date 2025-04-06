declare module "roslib" {
    export default class Ros {
      constructor(options: { url: string });
      on(event: string, callback: (arg?: any) => void): void;
      close(): void;
    }
  
    export class Topic {
      constructor(options: {
        ros: Ros;
        name: string;
        messageType: string;
      });
      subscribe(callback: (message: any) => void): void;
      unsubscribe(): void;
    }
  }