import React                        from 'react';
import { Route, IndexRoute }        from 'react-router';
import App                          from './containers/App';
import Dashboard                    from './containers/IndexRouteComponent';
import Message                      from './containers/Message';

export default (
  <Route path='/' component={ App }>
    <IndexRoute component={ Dashboard } />
    <Route path='message/:id' component={ Message } />
  </Route>
);
