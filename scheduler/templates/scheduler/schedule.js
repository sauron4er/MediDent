'use strict';
import React from 'react';
import ReactDOM from 'react-dom';

class Schedule extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="container-fluid m-3">
                <div className="row">
                    <div className="col-md-3">
                        Календар
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <Schedule />,
    document.getElementById('schedule')
);