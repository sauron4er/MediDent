'use strict';
import React from 'react';
import ReactDOM from 'react-dom';

import Modal from 'react-responsive-modal';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import Textarea from 'react-validation/build/textarea';

import axios from 'axios';
import querystring from 'querystring'; // for axios
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded, x-xsrf-token';

import {required} from './validations';
import './my_styles.css';
import MyTable from './my_table';

class Clients extends React.Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.newClient = this.newClient.bind(this);
    }

    state = {
        open: false,
        new_name: '',
        new_phone: '',
        new_note: '',

        clients: window.clients,
        clients_columns: [
            { name: 'name', title: 'Ім’я' },
            { name: 'phone', title: 'Телефон' },
          ],
        clients_column_width: [
            { columnName: 'phone', width: 100 },
        ]
    };

    onChange(event) {
        this.setState({[event.target.name]:event.target.value});
    }

    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

    // Додає нового клієнта у базу даних
    newClient(e) {
        e.preventDefault();

        axios({
            method: 'post',
            url: '',
            data: querystring.stringify({
                name: this.state.new_name,
                note: this.state.new_note,
                phone: this.state.new_phone,
            }),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
        }).then((response) => { // закриваємо і очищаємо модальне вікно, відправляємо дані нового документа в MyDocs
            document.getElementById("modal_clients_close").click();

            // передаємо нового клієнта у список, очищаємо форму
            const new_client = {
                id: response.data,
                name: this.state.new_name,
                note: this.state.new_note,
                phone: this.state.new_phone,
            };
            this.setState(prevState => ({
                clients: [...prevState.clients, new_client],
                new_name:'',
                new_phone:'',
                new_note: '',
                open: false,
            }));
        })
          .catch((error) => {
            console.log('errorpost: ' + error);
        });
    }

    render() {
        const { open } = this.state;
        return(
            <div className="container-fluid m-3">
                <div className="row">
                    <div className="col-md-4">
                        <button className="btn btn-outline-secondary mb-1 w-100" onClick={this.onOpenModal}>Додати клієнта</button>

                        <MyTable
                            rows={this.state.clients}
                            columns={this.state.clients_columns}
                            colWidth={this.state.clients_column_width}
                            filter
                        />
                    </div>
                </div>

                {/*форма нового клієнта*/}
                <Modal open={open} onClose={this.onCloseModal} center>

                    <Form onSubmit={this.newClient}>
                        <div className="modal-body">
                            <label className="full_width">Ім’я:
                                <Input className="full_width" size="40" value={this.state.new_name} name="new_name" onChange={this.onChange} validations={[required]}/>
                            </label><br/>
                            <label className="full_width">Номер телефону:
                                <Input className="full_width" value={this.state.new_phone} name="new_phone" onChange={this.onChange} />
                            </label><br/>
                            <label className="full_width">Нотатка:
                                <Textarea className="full_width" value={this.state.new_note} name='new_note' onChange={this.onChange} maxLength={4000}/>
                            </label> <br />
                        </div>

                        <div className="modal-footer">
                          <Button className="float-sm-left btn btn-outline-secondary mb-1">Підтвердити</Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        )
    }
}

ReactDOM.render(
    <Clients />,
    document.getElementById('lists')
);