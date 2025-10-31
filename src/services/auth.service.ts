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

  public async register(firstName: string, lastName: string, username: string, email: string, password: string, file?: File): Promise<string> {
    const mutation: string = `
      mutation Register($input: RegisterInput!, $file: Upload) {
        register(input: $input, file: $file)
      }
    `;

    const variables = {
      input: {
        firstName,
        lastName,
        username,
        email,
        password
      },
      file: file ? null : undefined
    }

    const formData: FormData = new FormData();
    formData.append(
      "operations",
      JSON.stringify({
        query: mutation,
        variables: variables
      })
    );

    if (file) {
      formData.append("map", JSON.stringify({
        "0": ["variables.file"]
      }));

      formData.append("0", file);
    }
    else {
      formData.append("map", JSON.stringify({}));
    }

    const response = await this.request<{register: string}>(mutation, variables, undefined, formData);
    return response.register;
  }

  public async checkUsernameAvailability(username: string): Promise<boolean> {
    const query: string = `
      query CheckUsernameAvailability($username: String!) {
        checkUsernameAvailability(username: $username)
      }
    `;

    const variables = {
      username
    }

    const response = await this.request<{checkUsernameAvailability: boolean}>(query, variables);
    return response.checkUsernameAvailability;
  }
}

export default AuthService;
