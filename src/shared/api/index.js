// list of apis

const API_ROOT_V1 = "/api/v1";

export function user(id) {
  return API_ROOT_V1 + "/users/" + id;
}

export function reqsAPI( id='' ) {
  return API_ROOT_V1 + "/reqs/" + id;
}

// reqs - queries header
export function reqsQueryHeaders ( reqId, headerId='' ) { 
  return `${API_ROOT_V1}/reqs/${reqId}/header/${headerId}`
}
