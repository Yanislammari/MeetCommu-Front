abstract class GraphQLService {
  private readonly endpoint: string;

  constructor() {
    this.endpoint = `${import.meta.env.VITE_BASE_URL}/graphql`;
  }

  public async request<T>(query: string, variables?: Record<string, any>, token?: string, formData?: FormData): Promise<T> {
    const response: Response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        ...(formData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData ? formData : JSON.stringify({
        query,
        variables
      })
    });

    const json = await response.json();

    if (json.errors) {
      throw new Error(json.errors[0].message || "GRAPHQL_ERROR");
    }

    return json.data as T;
  }
}

export default GraphQLService;
