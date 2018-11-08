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
import DxTable from './dx_table';

class Clients extends React.Component {

    state = {
        open: false,
        open_edit: false,
        new_name: '',
        new_phone: '',
        new_note: '',

        client_name: '',
        client_phone: '',
        client_note: '',
        client_id: '',

        clients: window.clients,
        clients_columns: [
            { name: 'name', title: 'Ім’я' },
            { name: 'phone', title: 'Телефон' },
          ],
        clients_column_width: [
            { columnName: 'phone', width: 100 },
        ]
    };

    // Додає нового клієнта у базу даних
    newClient = (e) => {
        e.preventDefault();

        axios({
            method: 'post',
            url: '',
            data: querystring.stringify({
                name: this.state.new_name,
                note: this.state.new_note,
                phone: this.state.new_phone,
                is_active: true,
            }),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
        }).then((response) => {

            // передаємо нового клієнта у список, очищаємо форму
            const new_client = {
                id: response.data,
                name: this.state.new_name,
                note: this.state.new_note,
                phone: this.state.new_phone,
            };

            this.setState(prevState => ({
                clients: [...prevState.clients, new_client],
                client_id: response.data,
                client_name: this.state.new_name,
                client_note: this.state.new_note,
                client_phone: this.state.new_phone,
                new_name:'',
                new_phone:'',
                new_note: '',
                open: false,
            }));
        }).catch((error) => {
            console.log('errorpost: ' + error);
        });
    };

    // Заносить у базу даних зміну даних про клієнта
    editClient = (e) => {
        e.preventDefault();

        axios({
            method: 'post',
            url: '' + this.state.client_id + '/',
            data: querystring.stringify({
                id: this.state.client_id,
                name: this.state.client_name,
                note: this.state.client_note,
                phone: this.state.client_phone,
                is_active: true,
            }),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
        }).then((response) => {
            const clients = this.state.clients;
            clients.map(client => {
                if (client.id === this.state.client_id) {
                    client.name = this.state.client_name;
                    client.phone = this.state.client_phone;
                    client.note = this.state.client_note;
                }
            });
            this.setState({
                clients: clients,
                open_edit: false,
            })
        }).catch((error) => {
            console.log('errorpost: ' + error);
        });
    };

    // Деактивує клієнта
    // TODO об’єднати функції editClient та deactivateClient
    deactivateClient = (e) => {
        e.preventDefault();

        axios({
            method: 'post',
            url: '' + this.state.client_id + '/',
            data: querystring.stringify({
                id: this.state.client_id,
                name: this.state.client_name,
                note: this.state.client_note,
                phone: this.state.client_phone,
                is_active: false,
            }),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
        }).then((response) => {
            const filtered_clients = this.state.clients.filter(client => client.id !== this.state.client_id);
            this.setState({
                clients: filtered_clients,
                open_edit: false,
                client_name: '',
                client_phone: '',
                client_note: '',
            })
        }).catch((error) => {
            console.log('errorpost: ' + error);
        });
    };

    // Показує інфу про обраного клієнта
    onRowClick = (row) => {
        this.setState({
            client_name: row.name,
            client_phone: row.phone,
            client_note: row.note,
            client_id: row.id,
        })
    };

    onChange = (event) => {
        this.setState({[event.target.name]:event.target.value});
    };

    onOpenModal = () => {
        this.setState({ open: true });
    };

    onOpenModalEdit = () => {
        this.setState({ open_edit: true });
    };

    onCloseModal = () => {
        this.setState({ open: false, open_edit: false });
    };


    render() {
        const { open, open_edit } = this.state;
        return(
            <div className="container-fluid m-3">
                <div className="row">
                    <div className="col-md-4">
                        <button className="btn btn-outline-secondary mb-1 w-100" onClick={this.onOpenModal}>Додати клієнта</button>

                        <DxTable
                            rows={this.state.clients}
                            columns={this.state.clients_columns}
                            colWidth={this.state.clients_column_width}
                            defaultSorting={[{ columnName: 'name', direction: 'asc' }]}
                            onRowClick={this.onRowClick}
                            filter
                        />
                    </div>
                    <div className="col-md-8">
                        <div className='row'>
                            <div className="col-md-9">
                                <h4>{this.state.client_name}</h4>
                            </div>
                            <div className="col-md-2">
                                <If condition={this.state.client_name !== ''}>
                                    <button className="btn btn-outline-secondary mb-1 w-100" onClick={this.onOpenModalEdit}>Редагувати</button>
                                </If>
                            </div>
                        </div>
                        <br/>
                        <h5>{this.state.client_phone}</h5>
                        <br/>
                        <h6>{this.state.client_note}</h6>
                    </div>
                </div>

                {/*форма нового клієнта*/}
                <Modal open={open} onClose={this.onCloseModal} center>
                    <Form onSubmit={this.newClient}>
                        <div className="modal-body css_40vw">
                            <label className="css_full_width">Ім’я:
                                <Input className="css_full_width" size="40" value={this.state.new_name} name="new_name" onChange={this.onChange} validations={[required]}/>
                            </label><br/>
                            <label className="css_full_width">Номер телефону:
                                <Input className="css_full_width" value={this.state.new_phone} name="new_phone" onChange={this.onChange} />
                            </label><br/>
                            <label className="css_full_width">Нотатка:
                                <Textarea className="css_full_width" value={this.state.new_note} name='new_note' onChange={this.onChange} maxLength={4000}/>
                            </label> <br />
                        </div>

                        <div className="modal-footer">
                          <Button className="float-sm-left btn btn-outline-secondary mb-1">Підтвердити</Button>
                        </div>
                    </Form>
                </Modal>

                {/*форма редагування клієнта*/}
                <Modal open={open_edit} onClose={this.onCloseModal} center>
                    <Form onSubmit={this.editClient}>
                        <div className="modal-body css_40vw">
                            <label className="css_full_width">Ім’я:
                                <Input className="css_full_width" size="40" value={this.state.client_name} name="client_name" onChange={this.onChange} validations={[required]}/>
                            </label><br/>
                            <label className="css_full_width">Номер телефону:
                                <Input className="css_full_width" value={this.state.client_phone} name="client_phone" onChange={this.onChange} />
                            </label><br/>
                            <label className="css_full_width">Нотатка:
                                <Textarea className="css_full_width css_20vh" value={this.state.client_note} name='client_note' onChange={this.onChange} maxLength={4000}/>
                            </label> <br />
                        </div>

                        <div className="modal-footer">
                            <Button className="float-sm-left btn btn-outline-secondary mb-1">Підтвердити</Button>
                            <Button className="float-sm-right btn btn-outline-secondary mb-1" onClick={this.deactivateClient}>Видалити клієнта</Button>
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