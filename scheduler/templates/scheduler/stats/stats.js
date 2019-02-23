'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import {required} from '../validations';
import SideMenu from '../side_menu/side_menu'
import '../my_styles.css';
import DxTable from "../dx_table";
import axios from "axios";
import querystring from "querystring";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded, x-xsrf-token';


class Stats extends React.Component {
  state = {
    doctors: window.doctors,
    doctors_columns: [
      {name: 'name', title: 'Лікарі'},
    ],
    selected_doctor: '',
    new_doctor: '',
  };

  onChange = (event) => {
    this.setState({[event.target.name]:event.target.value});
  };

  // клік на таблицю докторів
  onDoctorClick = (row) => {
    this.setState({
      selected_doctor: row,
    })
  };

  hireDoctor = (e) => {
    e.preventDefault();
    axios({
      method: 'post',
      url: 'new_doctor',
      data: querystring.stringify({
        name: this.state.new_doctor,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    }).then((response) => {
      this.setState(prevState => ({
        doctors: [...prevState.doctors, {id: response.data, name: this.state.new_doctor}],
        new_doctor: '',
      }))
    }).catch((error) => {
      console.log('errorpost: ' + error);
    });
  };

  fireDoctor = (e) => {
    e.preventDefault();
    axios({
      method: 'post',
      url: 'fire_doctor/' + this.state.selected_doctor.id + '/',
      data: querystring.stringify({}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    }).then((response) => {
      const filtered_doctors = this.state.doctors.filter(doctor => doctor.id !== this.state.selected_doctor.id);
      this.setState({
        doctors: filtered_doctors,
        selected_doctor: '',
      })
    }).catch((error) => {
      console.log('errorpost: ' + error);
    });
  };

  render() {
    const {doctors, doctors_columns, selected_doctor, new_doctor} = this.state;
    return (
      <div className="row">
        <div className="col-md-10">
          Тут колись буде статистика)
        </div>
        <div className='col-md-2'>
          <SideMenu/>

          <Form>
            <div>Додати лікаря:</div>
            <Input name='new_doctor' placeholder='Ф.І.О.' className='form-control' onChange={this.onChange} value={new_doctor} validations={[required]}/>
            <Button className='btn btn-sm btn-outline-success mt-1' onClick={this.hireDoctor}>Додати</Button>
          </Form>

          <DxTable
            rows={doctors}
            columns={doctors_columns}
            // colWidth={this.state.doctors_column_width}
            defaultSorting={[{columnName: 'name', direction: 'asc'}]}
            onRowClick={this.onDoctorClick}
            height={250}
          />
          <If condition={selected_doctor !== ''}>
            <div>Лікар:</div>
            <div>{selected_doctor.name}</div>
            <button className='btn btn-sm btn-outline-danger float-sm-left mt-1' type="button" onClick={this.fireDoctor}>Звільнити</button>
          </If>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
    <Stats />,
    document.getElementById('stats')
);