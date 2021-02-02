export interface IChannel {
    source: string;
    next: string;
    error: string;
    complete: string;
  }

export function buildChannel(name: string): IChannel {
    return {
      source: name,
      next: `${name}/next`,
      error: `${name}/error`,
      complete: `${name}/complete`,
    };
  }