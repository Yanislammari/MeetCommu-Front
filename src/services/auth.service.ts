import type { User } from "../models/User";
import GraphQLService from "./graphql.service";

class AuthService extends GraphQLService {
  public async login(identifier: string, password: string): Promise<string> {
    const mutation: string = `
      mutation Login($input: LoginInput!) {
        login(input: $input)
      }
    `;

    const variables = {
      input: {
        identifier,
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

  public async checkEmailAvailability(email: string): Promise<boolean> {
    const query: string = `
      query CheckEmailAvailability($email: Email!) {
        checkEmailAvailability(email: $email)
      }
    `;

    const variables = {
      email
    }

    const response = await this.request<{checkEmailAvailability: boolean}>(query, variables);
    return response.checkEmailAvailability;
  }

  public async sendResetPasswordMail(email: string): Promise<boolean> {
    const query: string = `
      mutation SendPasswordResetEmail($email: Email!) {
        sendPasswordResetEmail(email: $email)
      }
    `;

    const variables = {
      email
    }

    const response = await this.request<{sendPasswordResetEmail: boolean}>(query, variables);
    return response.sendPasswordResetEmail;
  }

  public async resetPassword(password: string, token: string): Promise<boolean> {
    const query: string = `
      mutation ResetPassword($password: Password!) {
        resetPassword(password: $password)
      }
    `;

    const variables = {
      password
    }

    const response = await this.request<{resetPassword: boolean}>(query, variables, token);
    return response.resetPassword;
  }

  public async verifyResetPasswordToken(token: string): Promise<boolean> {
    const query: string = `
      query {
        verifyResetPasswordToken
      }
    `;

    const response = await this.request<{verifyResetPasswordToken: boolean}>(query, undefined, token);
    return response.verifyResetPasswordToken;
  }

  public async loginWithGoogle(idToken: string): Promise<string> {
    const query: string = `
      mutation LoginWithGoogle($idToken: String!) {
        loginWithGoogle(idToken: $idToken)
      }
    `;

    const variables = {
      idToken
    }

    const response = await this.request<{loginWithGoogle: string}>(query, variables);
    return response.loginWithGoogle;
  }

  public async decodeToken(token: string): Promise<User> {
    const query: string = `
      query {
        me {
          id
          firstName
          lastName
          username
          email
          profilePictureUrl
          role
          visibility
        }
      }
    `;
  
    const response = await this.request<{ me: User }>(query, undefined, token);
    return response.me;
  }  
}

export default AuthService;
