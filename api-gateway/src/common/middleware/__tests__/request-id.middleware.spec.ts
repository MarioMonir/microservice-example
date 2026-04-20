import type { Request, Response } from 'express';
import { RequestIdMiddleware } from '@/common/middleware/request-id.middleware';

const HEADER = 'x-request-id';

function buildReq(headers: Record<string, string> = {}): Request {
  return {
    headers,
    header(name: string) {
      return headers[name.toLowerCase()];
    },
  } as unknown as Request;
}

function buildRes(): Response & { _headers: Record<string, string> } {
  const store: Record<string, string> = {};
  return {
    _headers: store,
    setHeader(name: string, value: string) {
      store[name.toLowerCase()] = value;
    },
  } as unknown as Response & { _headers: Record<string, string> };
}

describe('RequestIdMiddleware', () => {
  const mw = new RequestIdMiddleware();

  it('propagates an incoming x-request-id unchanged', () => {
    const incoming = 'abc-123';
    const req = buildReq({ [HEADER]: incoming });
    const res = buildRes();
    const next = jest.fn();

    mw.use(req, res, next);

    expect(req.headers[HEADER]).toBe(incoming);
    expect(res._headers[HEADER]).toBe(incoming);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('generates a UUID when no header is present', () => {
    const req = buildReq();
    const res = buildRes();
    const next = jest.fn();

    mw.use(req, res, next);

    const id = req.headers[HEADER] as string;
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    expect(res._headers[HEADER]).toBe(id);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
