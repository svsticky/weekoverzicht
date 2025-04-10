import {Result} from "@/scripts/result";
import {ApiError} from "@/scripts/error";

export async function fetch1(input: RequestInfo | URL, init?: RequestInit): Promise<Result<Response, ApiError>> {
  try {
    const r = await fetch(input, init);
    if (!r.ok) {
      return Result.err(ApiError.request(r.status, await r.text()));
    }
    
    return Result.ok(r);
  } catch (error: unknown) {
    return Result.err(ApiError.request(-1, (<any> error).toString()))
  }
}