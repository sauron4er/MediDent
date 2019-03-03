import React, {Fragment} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faUsers, faChartPie } from '@fortawesome/free-solid-svg-icons'
import '../my_styles.css'

class SideMenu extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <a className="badge badge-primary w-100 mt-1" href="schedule">
          <div className='btn btn-light btn-sm'>
            <FontAwesomeIcon icon={faCalendarAlt} />
          </div>
        </a>
        <a className="badge badge-primary w-100 mt-1" href="clients">
          <div className='btn btn-light btn-sm'>
            <FontAwesomeIcon icon={faUsers} />
          </div>
        </a>
        <a className="badge badge-primary w-100 mt-1" href="stats">
          <div className='btn btn-light btn-sm'>
            <FontAwesomeIcon icon={faChartPie} />
          </div>
        </a>
      </Fragment>
    )
  }
}

export default SideMenu;