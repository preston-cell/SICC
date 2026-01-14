/**
 * E2B REST API Client
 *
 * A lightweight client for E2B that uses the REST API directly,
 * avoiding SDK ESM compatibility issues with Convex's Node.js runtime.
 */

const E2B_API_URL = "https://api.e2b.dev";

interface SandboxInfo {
  sandboxID: string;
  templateID: string;
  clientID: string;
}

interface CommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export class E2BSandbox {
  private sandboxID: string;
  private apiKey: string;

  private constructor(sandboxID: string, apiKey: string) {
    this.sandboxID = sandboxID;
    this.apiKey = apiKey;
  }

  static async create(options: {
    template: string;
    timeoutMs?: number;
    apiKey: string;
  }): Promise<E2BSandbox> {
    const response = await fetch(`${E2B_API_URL}/sandboxes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": options.apiKey,
      },
      body: JSON.stringify({
        templateID: options.template,
        timeout: options.timeoutMs ? Math.floor(options.timeoutMs / 1000) : 300,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to create sandbox: ${response.status} ${text}`);
    }

    const data: SandboxInfo = await response.json();
    return new E2BSandbox(data.sandboxID, options.apiKey);
  }

  async runCommand(
    command: string,
    options?: {
      envs?: Record<string, string>;
      timeoutMs?: number;
      workdir?: string;
    }
  ): Promise<CommandResult> {
    const response = await fetch(
      `${E2B_API_URL}/sandboxes/${this.sandboxID}/commands`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.apiKey,
        },
        body: JSON.stringify({
          cmd: command,
          envVars: options?.envs || {},
          timeout: options?.timeoutMs ? Math.floor(options.timeoutMs / 1000) : 120,
          workdir: options?.workdir || "/home/user",
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to run command: ${response.status} ${text}`);
    }

    const data = await response.json();
    return {
      stdout: data.stdout || "",
      stderr: data.stderr || "",
      exitCode: data.exitCode || 0,
    };
  }

  async writeFile(path: string, content: string): Promise<void> {
    const response = await fetch(
      `${E2B_API_URL}/sandboxes/${this.sandboxID}/files`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.apiKey,
        },
        body: JSON.stringify({
          path,
          content,
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to write file: ${response.status} ${text}`);
    }
  }

  async readFile(path: string): Promise<string> {
    const encodedPath = encodeURIComponent(path);
    const response = await fetch(
      `${E2B_API_URL}/sandboxes/${this.sandboxID}/files?path=${encodedPath}`,
      {
        method: "GET",
        headers: {
          "X-API-Key": this.apiKey,
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to read file: ${response.status} ${text}`);
    }

    const data = await response.json();
    return data.content || "";
  }

  async kill(): Promise<void> {
    try {
      await fetch(`${E2B_API_URL}/sandboxes/${this.sandboxID}`, {
        method: "DELETE",
        headers: {
          "X-API-Key": this.apiKey,
        },
      });
    } catch {
      // Ignore errors when killing sandbox
    }
  }
}
