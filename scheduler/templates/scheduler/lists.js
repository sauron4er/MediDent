'use strict';
import React from 'react';
import ReactDOM from 'react-dom';

class NewClient extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <p>react list!!!</p>

        )
    }
}

ReactDOM.render(
    <NewClient />,
    document.getElementById('lists')
);