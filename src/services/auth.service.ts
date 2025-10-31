import GraphQLService from "./graphql.service";

class AuthService extends GraphQLService {
  public async login(email: string, password: string): Promise<string> {
    const mutation: string = `
      mutation Login($input: LoginInput!) {
        login(input: $input)
      }
    `;

    const variables = {
      input: {
        email,
        password
      }
    }

    const response = await this.request<{login: string}>(mutation, variables);
    return response.login;
  }
}

export default AuthService;
