'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-awesome-modal';
import Form from 'react-validation/build/form';
import Select from 'react-validation/build/select';
import Button from 'react-validation/build/button';
import Textarea from 'react-validation/build/textarea';
import { Scheduler } from 'devextreme-react';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.compact.css';
import querystring from 'querystring';
import DxTable from '../dx_table';
import SideMenu from '../side_menu/side_menu'
import '../my_styles.css';
import './schedule_style.css';
import axios from 'axios';
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded, x-xsrf-token';


class Schedule extends React.Component {

    state = {
        visits: window.visits,
        clients_columns: [
            { name: 'name', title: 'Ім’я' },
            { name: 'phone', title: 'Телефон' },
          ],
        clients_column_width: [
            { columnName: 'phone', width: 150 },
        ],
        opened_visit: '',

        new_note: '',
        new_client: '',
        new_client_id: '',
        new_start: '',
        new_finish: '',
        new_doctor: '',
        new_doctor_id: null,

        doctor: '',
        doctor_id: null,
        start: '',
        finish: '',
        note: '',
        client: '',

        open: false,
        open_edit: false,
    };

    getIndex = (id, array) => {
        for(let i = 0; i < array.length; i++) {
            if(array[i].id === id) {
                return i;
            }
        }
        return -1;
    };

    onChange = (event) => {
        if (event.target.name === 'new_doctor') {
            const selectedIndex = event.target.options.selectedIndex;
            this.setState({
                new_doctor_id: event.target.options[selectedIndex].getAttribute('data-key'),
                new_doctor: event.target.options[selectedIndex].getAttribute('value'),
            });
        }
        if (event.target.name === 'doctor') {
            const selectedIndex = event.target.options.selectedIndex;
            this.setState({
                doctor_id: event.target.options[selectedIndex].getAttribute('data-key'),
                doctor: event.target.options[selectedIndex].getAttribute('value'),
            });
        }
        else {
            this.setState({[event.target.name]:event.target.value});
        }
    };

    // Повертає дату та час нового візиту у форму
    getVisitsTime(time) {
        const visitTime = new Date(time);
        const return_day = visitTime.getFullYear() + '.' + parseInt(visitTime.getMonth()+1) + '.' + visitTime.getDate();
        const return_time =  visitTime.getHours() + ':00:00';
        return (return_day + ' ' + return_time);
    }

    // додає візит у бд і список
    addVisit = (e) => {
        e.preventDefault();
        axios({
            method: 'post',
            url: '',
            data: querystring.stringify({
                doctor: this.state.new_doctor_id,
                client: this.state.new_client_id,
                start: this.state.new_start.toLocaleString(),
                finish: this.state.new_finish.toLocaleString(),
                note: this.state.new_note,
            }),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
        }).then((response) => {
            // передаємо нового клієнта у список, очищаємо форму
            const new_visit = {
                id: response.data,
                text: this.state.new_client,
                doctor: this.state.new_doctor,
                note: this.state.new_note,
                startDate: this.state.new_start,
                endDate: this.state.new_finish,
            };

            this.setState(prevState => ({
                visits: [...prevState.visits, new_visit],
            }));
            this.closeForm();
        }).catch((error) => {
            console.log('errorpost: ' + error);
        });
    };

    // видаляє візит з бд і списку
    delVisit = (e) => {
        axios({
            method: 'post',
            url: 'change_visit/' + e.appointmentData.id + '/',
            data: querystring.stringify({
                change: 'delete',
                is_active: false,
            }),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
        }).then((response) => {
        }).catch((error) => {
            console.log('errorpost: ' + error);
        });
    };

    changeVisitsTime = (e) => {
        // e.preventDefault();
        axios({
            method: 'post',
            url: 'change_visit/' + e.appointmentData.id + '/',
            data: querystring.stringify({
                change: 'time',
                start: e.appointmentData.startDate,
                finish: e.appointmentData.endDate,
            }),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
        }).then((response) => {
        }).catch((error) => {
            console.log('errorpost: ' + error);
        });
    };

    changeVisitsDoctorOrNote = (e) => {
        e.preventDefault();
        if (this.state.note !== this.state.opened_visit.note || this.state.doctor !== this.state.opened_visit.doctor ) {
            axios({
                method: 'post',
                url: 'change_visit/' + this.state.opened_visit.id + '/',
                data: querystring.stringify({
                    change: 'doctor_note',
                    doctor: this.state.doctor_id,
                    note: this.state.note,
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            }).then((response) => {
                const index = this.getIndex(this.state.opened_visit.id, this.state.visits);
                let temp_visits = this.state.visits;
                temp_visits[index].note = this.state.note;
                temp_visits[index].doctor = this.state.doctor;
                this.setState({visits: temp_visits});
                this.closeForm();
            }).catch((error) => {
                console.log('errorpost: ' + error);
            });
        }
    };

    onRowClick = (row) => {
        this.setState({
            new_client_id: row.id,
            new_client: row.name,
        })
    };

    // показує форму нового візиту, записує в state обраний час
    onCellClick = (e) => {
        if (e.cellData) { // клацнули пусту ячейку:
            this.setState({
                open: true,
                new_start: e.cellData.startDate,
                new_finish: e.cellData.endDate,
            })
        }
        else {
            this.setState({
                open: true,
                new_start: e.appointmentData.startDate,
                new_finish: e.appointmentData.endDate,
            })
        }
    };

    // відкриває модульне вікно для редагування прийому
    onAppDblClick = (e) => {
        e.cancel = true;
        this.setState({
            opened_visit: e.appointmentData,
            note: e.appointmentData.note,
            start: e.appointmentData.startDate,
            finish: e.appointmentData.endDate,
            doctor: e.appointmentData.doctor,
            client: e.appointmentData.text,
            open_edit: true
        })
    };

    // закриває форму, очищує поля
    closeForm = () => {
        this.setState({
            open: false,
            open_edit: false,
            new_client_id: '',
            new_client: '',
            new_note: '', // textarea не може бути null - мусить бути строка
            new_doctor_id: null,
            new_doctor: '',
            new_start: '',
            new_finish: '',
        })
    };

    render() {
        return(
            <div className='row'>
                <div className='col-md-10'>
                    <Scheduler
                        id='scheduler'
                        dataSource={this.state.visits}
                        height={'auto'}
                        views={[
                            { name: "Тиждень", type: "week", startDate: new Date() },
                            { name: "2 тижні", type: "week", intervalCount: 2, startDate: new Date() },
                            { name: "День", type: "day", startDate: new Date() },
                        ]}
                        defaultCurrentView={'week'}
                        defaultCurrentDate={new Date()}
                        startDayHour={8}
                        endDayHour={21}
                        firstDayOfWeek={1}
                        cellDuration={60}
                        showAllDayPanel={false}
                        onCellClick={this.onCellClick}
                        onAppointmentClick={(e) => {e.cancel = true;}}
                        onAppointmentUpdated={this.changeVisitsTime}
                        onAppointmentDeleted={this.delVisit}
                        onAppointmentDblClick={this.onAppDblClick}
                        maxAppointmentsPerCell={'unlimited'}
                        shadeUntilCurrentTime={true}
                        crossScrollingEnabled={true} // щоб працювало css
                        allowDragging={true}
                    />

                    {/* Модальне вікно створення нового прийому */}
                    <Modal visible={this.state.open} effect="fadeInUp" onClickAway={this.closeForm}>
                        <div className='css_third_width p-3'>
                            <button type="button" className="close" aria-label="Close" onClick={this.closeForm}>
                                <span className='text-primary' aria-hidden="true">&times;</span>
                            </button>
                            <Form onSubmit={this.addVisit}>
                                <div className='font-weight-bold'>Новий прийом</div>
                                <div className='css_full_width text-right'>Час прийому: {this.getVisitsTime(this.state.new_start)}</div>
                                <div>Оберіть клієнта:</div>
                                <DxTable
                                    rows={window.clients}
                                    columns={this.state.clients_columns}
                                    colWidth={this.state.clients_column_width}
                                    defaultSorting={[{ columnName: 'name', direction: 'asc' }]}
                                    onRowClick={this.onRowClick}
                                    filter
                                    height={309}
                                /><br/>

                                <label className="css_full_width">Нотатка:
                                    <Textarea className="css_full_width form-control" value={this.state.new_note} name='new_note' onChange={this.onChange} maxLength={500}/>
                                </label> <br />

                                <label className="css_full_width">Доктор:
                                    <Select id='doctor_select' name='new_doctor' className="full_width form-control" value={this.state.new_doctor} onChange={this.onChange}>
                                        <option data-key={0} value='Не внесено'>------------</option>
                                        {
                                            window.doctors.map(doctor => {
                                                return <option key={doctor.id} data-key={doctor.id}
                                                    value={doctor.name}>{doctor.name}</option>;
                                            })
                                        }
                                    </Select>
                                </label>

                                <Button className='float-sm-right btn btn-outline-primary mb-3'>Підтвердити</Button>
                            </Form>
                        </div>
                    </Modal>

                    {/* Модальне вікно редагування прийому */}
                    <Modal visible={this.state.open_edit} effect="fadeInUp" onClickAway={this.closeForm}>
                        <div className='css_third_width p-3'>
                            <button type="button" className="close" aria-label="Close" onClick={this.closeForm}>
                                <span className='text-primary' aria-hidden="true">&times;</span>
                            </button>
                            <Form onSubmit={this.changeVisit}>
                                <div className='font-weight-bold'>Клієнт: {this.state.client}</div>
                                <div className='css_full_width text-right'>Час прийому: {this.getVisitsTime(this.state.start)}</div>


                                <label className="css_full_width">Нотатка:
                                    <Textarea className="css_full_width form-control" value={this.state.note} name='note' onChange={this.onChange} maxLength={500}/>
                                </label> <br />

                                <label className="css_full_width">Доктор:
                                    <Select id='doctor_select' name='doctor' className="full_width form-control" value={this.state.doctor} onChange={this.onChange}>
                                        <option data-key={0} value='Не внесено'>------------</option>
                                        {
                                            window.doctors.map(doctor => {
                                                return <option key={doctor.id} data-key={doctor.id}
                                                    value={doctor.name}>{doctor.name}</option>;
                                            })
                                        }
                                    </Select>
                                </label>
                                <hr/>
                                <Button className="float-sm-left btn btn-outline-primary my-3" onClick={this.changeVisitsDoctorOrNote}>Підтвердити</Button>
                                <Button className="float-sm-right btn btn-outline-secondary my-3" onClick={this.deactivateClient}>Видалити прийом</Button>

                            </Form>
                        </div>
                    </Modal>
                </div>
                <div className='col-md-2'>
                    <SideMenu/>
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <Schedule />,
    document.getElementById('schedule')
);