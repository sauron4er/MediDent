'use strict';
import React from 'react';
import ReactDOM from 'react-dom';

import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import Textarea from 'react-validation/build/textarea';

import {required} from './validations';
import './my_styles.css';

class Clients extends React.Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.newClient = this.newClient.bind(this);
    }

    state = {
        new_name: '',
        new_phone: '',
        new_note: '',

        clients: window.clients,
    };

    onChange(event) {
        this.setState({[event.target.name]:event.target.value});
    }

    // Додає нового клієнта
    newClient(e) {
        e.preventDefault();

        axios({
            method: 'post',
            url: '',
            data: querystring.stringify({
                new_free_time: '',
                document_type: 1,
                free_day: this.state.date,
                text: this.state.text,
                employee_seat: this.props.my_seat_id,
            }),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
        }).then((response) => { // закриваємо і очищаємо модальне вікно, відправляємо дані нового документа в MyDocs
            document.getElementById("modal_freetime_close").click();

            const today = new Date();
            this.setState({
                date:'',
                text:'',
            });

            this.props.addDoc(response.data, 'Звільнююча перепустка', today.getDate() + '.' + today.getMonth() + '.' + today.getFullYear(), this.props.my_seat_id, 1);
        })
          .catch(function (error) {
            console.log('errorpost: ' + error);
        });
    }

    render() {
        return(
            <div className="container-fluid m-3">
                <div className="row">
                    <div className="col-md-3">

                        <button type="button" className="btn btn-outline-secondary mb-1 w-100" data-toggle="modal" data-target="#modalNewClient" id="button_new_client">Новий клієнт</button>
                        {/*форма нового клієнта*/}
                        <div className="container">
                          <div className="modal fade" id="modalNewClient">
                            <div className="modal-dialog modal-sm modal-dialog-centered">
                              <div className="modal-content">

                                <div className="modal-header">
                                  <h4 className="modal-title">Новий клієнт</h4>
                                  <button type="button" className="close" data-dismiss="modal" id="modal_new_client_close">&times;</button>
                                </div>

                                <Form onSubmit={this.newClient}>
                                    <div className="modal-body">
                                        <label className="full_width">Ім’я:
                                            <Input className="full_width" value={this.state.new_name} name="new_name" onChange={this.onChange} validations={[required]}/>
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

                              </div>
                            </div>
                          </div>
                </div>

                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <Clients />,
    document.getElementById('lists')
);