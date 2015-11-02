'use strict';

export default function(app, mongoose) {
  // embeddable docs first
  require('../schema/reqsQueries')(app, mongoose);

  // then regular docs
  require('../schema/users')(app, mongoose);
  require('../schema/reqs')(app, mongoose);

};
