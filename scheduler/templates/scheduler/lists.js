'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDataGrid from 'react-data-grid';

class NewClient extends React.Component {
    constructor(props) {
        super(props);
        this.createClientsRows();
        this.clients_columns = [
          { key: 'name',
            name: 'Ім’я',
            width: 353,
          },
          { key: 'phone',
            name: 'Тел.',
            width: 110,
          }, ];
      }

      state = {
        clients: window.clients,
    };

      createClientsRows = () => {
        let rows = [];
        this.state.clients.map(client => {
          rows.push({
            name: client.name,
            phone: client.phone,
          });
        });

        this.clients_rows = rows;
      };

      rowGetter = (i) => {
        return this.clients_rows[i];
      };



    render() {
        console.log('clients: ' + this.state.clients);
        return(
            <div className="container-fluid m-3">
                <div className="row">
                    <div className="col-md-3">
                        <label htmlFor="clients_grid">Список клієнтів:</label>
                        <ReactDataGrid
                            id="clients_grid"
                            columns={this.clients_columns}
                            rowGetter={this.rowGetter}
                            rowsCount={this.clients_rows.length}
                            minHeight={500}/>
                    </div>
                </div>
            </div>

        )
    }
}

ReactDOM.render(
    <NewClient />,
    document.getElementById('lists')
);