//Auth check middleware
function isAuth(req, res, next) {
  //console.dir('api route called')
  next();
}

export default function(app, passport) { // for checksum reasons, the router needs to come from the server

  //app.get('/api/v1/reqs/', isAuth, require('./api/v1/reqs').showAllReqs);
  app.put('/api/v1/reqs/:id', isAuth, require('./api/v1/reqs').editReqs);
  app.post('/api/v1/reqs/', isAuth, require('./api/v1/reqs').createReqs);
  app.delete('/api/v1/reqs/:id', isAuth, require('./api/v1/reqs').deleteReqs);

  // reqs query headers
  app.post('/api/v1/reqs/:reqId/header/', isAuth, require('./api/v1/reqsQueryHeaders').createReqsQueryHeader);

} // end of 'export'
