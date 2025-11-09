import type { User } from "../models/User";
import GraphQLService from "./GraphQLService";

class UserService extends GraphQLService {
  public async getUserById(id: string): Promise<User> {
    const query: string = `
      query User($id: ID!) {
        user(id: $id)
      }
    `;

    const variables = {
      id
    }

    const response = await this.request<{user: User}>(query, variables);
    return response.user;
  }
}

export default UserService;
