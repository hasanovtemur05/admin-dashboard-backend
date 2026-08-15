export interface UserRepository {
  findByUsername(username: string): Promise<any>;
  findById(id: string): Promise<any>;
  findAll(query: any): Promise<any>;
  create(data: any): Promise<any>;
}
