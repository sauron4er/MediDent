import React, {Fragment} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faUsers, faChartPie } from '@fortawesome/free-solid-svg-icons'
import '../my_styles.css'

class SideMenu extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <a className="badge w-100" href="schedule">
          <div className='btn btn-primary btn-sm w-100'>
            <FontAwesomeIcon icon={faCalendarAlt} />
          </div>
        </a>
        <a className="badge w-100" href="clients">
          <div className='btn btn-primary btn-sm w-100'>
            <FontAwesomeIcon icon={faUsers} />
          </div>
        </a>
        <a className="badge w-100" href="stats">
          <div className='btn btn-primary btn-sm w-100'>
            <FontAwesomeIcon icon={faChartPie} />
          </div>
        </a>
      </Fragment>
    )
  }
}

export default SideMenu;