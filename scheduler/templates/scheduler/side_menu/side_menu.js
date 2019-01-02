import React, {Fragment} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faUsers, faChartPie } from '@fortawesome/free-solid-svg-icons'
import '../my_styles.css'

class SideMenu extends React.PureComponent {
    render() {
        return (
            <div className='row d-flex justify-content-center'>
                <a className="col-3 bg-primary css_side_menu_col" href="schedule">
                    <div className='btn btn-light btn-sm'>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                    </div>
                </a>
                <a className="col-3 bg-primary css_side_menu_col" href="clients">
                    <div className='btn btn-light btn-sm'>
                        <FontAwesomeIcon icon={faUsers} />
                    </div>
                </a>
                <a className="col-3 bg-primary css_side_menu_col" href="stats">
                    <div className='btn btn-light btn-sm'>
                        <FontAwesomeIcon icon={faChartPie} />
                    </div>
                </a>
            </div>
        )
    }
}

export default SideMenu;