import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import './styles.scss';

const Home = React.lazy(() => import('../../../pages/Home/Home'));
const Room = React.lazy(() => import('../../../pages/Room'));

function Content() {
  return (
    <div className="Content">
      <Router>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/room/:roomId">
            <Room />
          </Route>
          <Route path="/">
            <Redirect to="/" />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default Content;
