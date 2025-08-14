export class MetrifoxError extends Error {
  public status: number;
  public statusText: string;
  public details: any;

  constructor(
    message: string,
    status: number,
    statusText: string,
    details: any = null
  ) {
    super(message);
    this.name = "MetrifoxError";
    this.status = status;
    this.statusText = statusText;
    this.details = details;
  }

  public getDisplayMessage(): string {
    if (this.details?.error) return this.details.error;
    if (this.details?.message) return this.details.message;
    return this.message;
  }
}
