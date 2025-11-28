export async function respondWithErrorJson(res, code, msg) {
  respondWithJson(res, code, { error: msg });
}

export async function respondWithJson(res, code, payload) {
  let jsonData = JSON.stringify(payload);
  res.header("Content-Type", "application/json");
  res.status(code).send(jsonData);
}

export const HTTPCodes = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
