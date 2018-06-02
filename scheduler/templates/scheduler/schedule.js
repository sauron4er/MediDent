'use strict';
import React from 'react';
import ReactDOM from 'react-dom';

class Schedule extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <p>react schedule!!!!!11111</p>
        )
    }
}

ReactDOM.render(
    <Schedule />,
    document.getElementById('schedule')
);