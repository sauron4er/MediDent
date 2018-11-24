import React, {Fragment} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faUsers, faChartPie } from '@fortawesome/free-solid-svg-icons'
import '../my_styles.css'

class SideMenu extends React.PureComponent {
    render() {
        return (
            <Fragment>
                <div className='row'>
                    <a className="col-3 bg-primary css_menu_col" href="schedule">
                        <div className='btn btn-light btn-sm'>
                            <FontAwesomeIcon icon={faCalendarAlt} />
                        </div>
                    </a>
                    <a className="col-3 bg-primary css_menu_col" href="clients">
                        <div className='btn btn-light btn-sm'>
                            <FontAwesomeIcon icon={faUsers} />
                        </div>
                    </a>
                    <a className="col-3 bg-primary css_menu_col" href="stats">
                        <div className='btn btn-light btn-sm'>
                            <FontAwesomeIcon icon={faChartPie} />
                        </div>
                    </a>
                </div>
            </Fragment>
        )
    }
}

export default SideMenu;