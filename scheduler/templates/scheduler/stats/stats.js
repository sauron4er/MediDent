'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import SideMenu from '../side_menu/side_menu'
import '../my_styles.css';

class Stats extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="row">
                <div className="col-md-10">
                    Статистика
                </div>
                <div className='col-md-2'>
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