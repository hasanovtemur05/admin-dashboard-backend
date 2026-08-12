export interface UserRepository {
  findByUsername(username: string): Promise<any>;
  findById(id: number): Promise<any>;
  findAll(query: any): Promise<any>;
  create(data: any): Promise<any>;
}
