declare module "bun:sqlite" {
  export class Database {
    constructor(path: string);
    run(sql: string, ...params: any[]): void;
    query(sql: string, ...params: any[]): any;
    // ajoute ici les signatures que tu utilises
  }
}
