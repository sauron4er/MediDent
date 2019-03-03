'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-awesome-modal';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import Textarea from 'react-validation/build/textarea';
import querystring from 'querystring'; // for axios
import {required} from '../validations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons'
import SideMenu from '../side_menu/side_menu'
import DxTable from '../dx_table';
import '../my_styles.css';
import axios from 'axios';
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded, x-xsrf-token';


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
      { name: 'name', title: 'Клієнт' },
      { name: 'phone', title: 'Телефон' },
    ],
    clients_column_width: [
      { columnName: 'phone', width: 120 },
    ]
  };

  onChange = (event) => {
    this.setState({[event.target.name]:event.target.value});
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
    return(
      <div className="row">
        <div className="col-md-4 pt-2 pl-4 css_full_width">
          <button className="btn btn-outline-primary mb-1 w-100" onClick={this.onOpenModal}>Додати клієнта</button>
          <DxTable
            rows={this.state.clients}
            columns={this.state.clients_columns}
            colWidth={this.state.clients_column_width}
            defaultSorting={[{ columnName: 'name', direction: 'asc' }]}
            onRowClick={this.onRowClick}
            filter
          />
        </div>

        {/*форма нового клієнта*/}
        <Modal visible={this.state.open} effect="fadeInUp" onClickAway={this.onCloseModal}>
          <div className='css_third_width p-3'>
            {/*<button type="button" className="close" aria-label="Close" onClick={this.onCloseModal}>*/}
              {/*<span className='text-primary' aria-hidden="true">&times;</span>*/}
            {/*</button>*/}
            <Form onSubmit={this.newClient}>
              <div className="modal-body">
                <label className="css_full_width mt-2">Ім’я:
                  <Input className="css_full_width form-control" size="40" value={this.state.new_name} name="new_name" onChange={this.onChange} validations={[required]}/>
                </label><br/>
                <label className="css_full_width">Номер телефону:
                  <Input className="css_full_width form-control" value={this.state.new_phone} name="new_phone" onChange={this.onChange} />
                </label><br/>
                <label className="css_full_width">Нотатка:
                  <Textarea className="css_full_width form-control" value={this.state.new_note} name='new_note' onChange={this.onChange} maxLength={4000}/>
                </label> <br />
              </div>

              <div className="modal-footer">
                <Button className="float-sm-left btn btn-outline-primary mb-1">Підтвердити</Button>
              </div>
            </Form>
          </div>
        </Modal>

        {/*форма редагування клієнта*/}
        <Modal visible={this.state.open_edit} effect="fadeInUp" onClickAway={this.onCloseModal}>
          <div className='css_third_width p-3'>
            <Form onSubmit={this.editClient}>
              <div className="modal-body">
                <label className="css_full_width">Ім’я:
                  <Input className="css_full_width form-control" size="40" value={this.state.client_name} name="client_name" onChange={this.onChange} validations={[required]}/>
                </label><br/>
                <label className="css_full_width">Номер телефону:
                  <Input className="css_full_width form-control" value={this.state.client_phone} name="client_phone" onChange={this.onChange} />
                </label><br/>
                <label className="css_full_width">Нотатка:
                  <Textarea className="css_full_width css_20vh form-control" value={this.state.client_note} name='client_note' onChange={this.onChange} maxLength={4000}/>
                </label> <br />
              </div>

              <div className="modal-footer">
                <Button className="float-sm-left btn btn-outline-primary mb-1">Підтвердити</Button>
                <Button className="float-sm-right btn btn-outline-secondary mb-1" onClick={this.deactivateClient}>Видалити клієнта</Button>
              </div>
            </Form>
          </div>
        </Modal>

        <div className="col-md-7 pt-2">
          <div className='row'>
            <h4>{this.state.client_name}</h4>
            <If condition={this.state.client_name !== ''}>
              <button className="btn btn-outline-secondary btn-sm ml-2" onClick={this.onOpenModalEdit}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </If>
          </div>
          <br/>
          <h5>{this.state.client_phone}</h5>
          <br/>
          <h6>{this.state.client_note}</h6>
        </div>
        <div className='col-md-1'>
          <SideMenu/>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <Clients />,
  document.getElementById('lists')
);