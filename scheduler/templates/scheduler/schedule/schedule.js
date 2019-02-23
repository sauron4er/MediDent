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

// TODO: Внесення оплати

class Schedule extends React.Component {

    state = {
        second_week: new Date().setDate(new Date().getDate() + 7),    // Дати для синхронізації календарів
        third_week: new Date().setDate(new Date().getDate() + 14),
        forth_week: new Date().setDate(new Date().getDate() + 21),

        visits: window.visits,
        clients_columns: [
            { name: 'name', title: 'Ім’я' },
            { name: 'phone', title: 'Телефон' },
          ],
        clients_column_width: [
            { columnName: 'phone', width: 150 },
        ],
        opened_visit: '',

        client_visits: [], // список майбутніх візитів клієнта

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
        price: '',

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
        else if (event.target.name === 'doctor') {
            const selectedIndex = event.target.options.selectedIndex;
            this.setState({
                doctor_id: event.target.options[selectedIndex].getAttribute('data-key'),
                doctor: event.target.options[selectedIndex].getAttribute('value'),
            });
        }
        else if (event.target.name === 'price') {
            this.setState({[event.target.name]:event.target.value.replace(/\D/,'')});
        }
        else {
            this.setState({[event.target.name]:event.target.value});
        }
    };

    // Надає дату та час нового візиту для показу у формі
    getVisitsTime(time) {
        const visitTime = new Date(time);
        const return_day = visitTime.getDate() + '.' + parseInt(visitTime.getMonth()+1) + '.' + visitTime.getFullYear();
        const return_time =  visitTime.getHours() + ':00:00';
        return (return_day + ', ' + return_time);
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

    changeVisitsInfo = (e) => {
        e.preventDefault();
        if (this.state.note !== this.state.opened_visit.note ||
            this.state.doctor !== this.state.opened_visit.doctor ||
            this.state.price !== this.state.opened_visit.price ) {
            axios({
                method: 'post',
                url: 'change_visit/' + this.state.opened_visit.id + '/',
                data: querystring.stringify({
                    change: 'info',
                    doctor: this.state.doctor_id,
                    note: this.state.note,
                    price: this.state.price,
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            }).then((response) => {
                const index = this.getIndex(this.state.opened_visit.id, this.state.visits);
                let temp_visits = this.state.visits;
                temp_visits[index].note = this.state.note;
                temp_visits[index].doctor = this.state.doctor;
                temp_visits[index].price = this.state.price;
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
        this.setState({
            open: true,
            new_start: e.cellData.startDate,
            new_finish: new Date(e.cellData.startDate.getTime() + 50*60000),
        });
    };

    // при одинарному кліку на прийом показує інфу про майбутні прийоми клієнтьа
    onVisitClick = (e) => {
        e.cancel = true;
        this.setState({
            client: e.appointmentData.text,
            client_visits: [],
        });
        axios({
            method: 'get',
            url: 'client_visits/' + e.appointmentData.id + '/',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        }).then((response) => {
            this.setState({
                client_visits: response.data
            })
        }).catch((error) => {
            console.log('errorpost: ' + error);
        });
    };

    // відкриває модульне вікно для редагування прийому
    onAppDblClick = (e) => {
        e.cancel = true;
        this.setState({
            opened_visit: e.appointmentData, // окремий запис всіх даних для звірки, чи відбулись зміни перед збереженням
            note: e.appointmentData.note,
            start: e.appointmentData.startDate,
            finish: e.appointmentData.endDate,
            doctor: e.appointmentData.doctor,
            client: e.appointmentData.text,
            price: e.appointmentData.price,
            open_edit: true
        })
    };

    // синхронізує календарі по датам при зміні у першому
    syncSchedulers = (e) => {
        if (e.name === 'currentDate') {
            if (e.value !== 'yyyy/MM/dd HH:mm:ss') {
                // Синхронізуємо дати
                let first_week = new Date(e.value);
                let second_week = new Date(e.value);
                let third_week = new Date(e.value);
                let forth_week = new Date(e.value);

                second_week.setDate(first_week.getDate() + 7);
                third_week.setDate(first_week.getDate() + 14);
                forth_week.setDate(first_week.getDate() + 21);

                this.setState({
                    second_week: second_week,
                    third_week: third_week,
                    forth_week: forth_week,
                });

                // Отримуємо дані про візити
                const day = e.value.getFullYear() + '/' + parseInt(e.value.getMonth() + 1) + '/' + e.value.getDate();
                axios({
                    method: 'get',
                    url: 'visits_list/' + day + '/',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                }).then((response) => {
                    this.setState({
                        visits: response.data
                    })
                }).catch((error) => {
                    console.log('errorpost: ' + error);
                });
            }
        }
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

    // TODO Переробити модальне вікно на стандартне бутстреповське, шоб не мигав scheduler

    render() {
        const today = new Date();
        const {second_week, third_week, forth_week, client, client_visits} = this.state;

        return(
            <div className='row'>
                <div className='col-md-10'>
                    <Scheduler
                        id='first_scheduler'
                        dataSource={this.state.visits}
                        height={'auto'}
                        defaultCurrentView={'week'}
                        defaultCurrentDate={today}
                        startDayHour={8}
                        endDayHour={21}
                        firstDayOfWeek={1}
                        cellDuration={60}
                        showAllDayPanel={false}
                        onAppointmentUpdated={this.changeVisitsTime}
                        onAppointmentDeleted={this.delVisit}
                        onCellClick={this.onCellClick}
                        onAppointmentClick={this.onVisitClick}
                        onAppointmentDblClick={this.onAppDblClick}
                        maxAppointmentsPerCell={'unlimited'}
                        shadeUntilCurrentTime={true}
                        editing={{'allowResizing':false}}
                        onOptionChanged={this.syncSchedulers}
                    />
                    <Scheduler
                        id='not_first_scheduler'
                        dataSource={this.state.visits}
                        height={'auto'}
                        currentView={'week'}
                        currentDate={new Date(second_week)}
                        startDayHour={8}
                        endDayHour={21}
                        firstDayOfWeek={1}
                        cellDuration={60}
                        showAllDayPanel={false}
                        onCellClick={this.onCellClick}
                        onAppointmentUpdated={this.changeVisitsTime}
                        onAppointmentDeleted={this.delVisit}
                        onAppointmentClick={this.onVisitClick}
                        onAppointmentDblClick={this.onAppDblClick}
                        maxAppointmentsPerCell={'unlimited'}
                        shadeUntilCurrentTime={true}
                        editing={{'allowResizing':false}}
                    />
                    <Scheduler
                        id='not_first_scheduler'
                        dataSource={this.state.visits}
                        height={'auto'}
                        currentView={'week'}
                        currentDate={third_week}
                        startDayHour={8}
                        endDayHour={21}
                        firstDayOfWeek={1}
                        cellDuration={60}
                        showAllDayPanel={false}
                        onCellClick={this.onCellClick}
                        onAppointmentUpdated={this.changeVisitsTime}
                        onAppointmentDeleted={this.delVisit}
                        onAppointmentClick={this.onVisitClick}
                        onAppointmentDblClick={this.onAppDblClick}
                        maxAppointmentsPerCell={'unlimited'}
                        shadeUntilCurrentTime={true}
                        editing={{'allowResizing':false}}
                    />
                    <Scheduler
                        id='not_first_scheduler'
                        dataSource={this.state.visits}
                        height={'auto'}
                        currentView={'week'}
                        currentDate={forth_week}
                        startDayHour={8}
                        endDayHour={21}
                        firstDayOfWeek={1}
                        cellDuration={60}
                        showAllDayPanel={false}
                        onCellClick={this.onCellClick}
                        onAppointmentUpdated={this.changeVisitsTime}
                        onAppointmentDeleted={this.delVisit}
                        onAppointmentClick={this.onVisitClick}
                        onAppointmentDblClick={this.onAppDblClick}
                        maxAppointmentsPerCell={'unlimited'}
                        shadeUntilCurrentTime={true}
                        editing={{'allowResizing':false}}
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
                            <Form onSubmit={this.changeVisitsInfo}>
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

                                <label className="css_full_width d-flex align-items-end">
                                    <span>Сплачено:</span>
                                    <input className="form-control w-25 mx-1" value={this.state.price} name='price' onChange={this.onChange}/>
                                    <span>грн.</span>
                                </label>

                                <hr/>
                                <Button className="float-sm-left btn btn-outline-primary my-3" onClick={this.changeVisitsInfo}>Підтвердити</Button>
                            </Form>
                        </div>
                    </Modal>
                </div>
                <div className='col-md-2'>
                    <SideMenu/>
                    <div className='border border-primary rounded p-1 mt-2 text-center'>
                        <div className='font-weight-bold'>{client}</div>
                        <For each='visit' index='id' of={client_visits}>
                            <div key={visit.id}>
                                {visit.start}
                            </div>
                        </For>
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