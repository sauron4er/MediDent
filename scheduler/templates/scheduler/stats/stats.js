'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import SideMenu from '../side_menu/side_menu';
import Doctors from "./doctors";
import '../my_styles.css';
import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded, x-xsrf-token';


class Stats extends React.Component {
  state = {

  };

  render() {
    return (
      <div className="row">
        <div className="col-md-9">
          Тут колись буде статистика)
        </div>

        <div className="col-md-2">
          <Doctors doctors={window.doctors}/>
        </div>

        <div className='col-md-1'>
          <SideMenu/>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
    <Stats />,
    document.getElementById('stats')
);