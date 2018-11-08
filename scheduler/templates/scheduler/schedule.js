'use strict';
import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-responsive-modal';
import Form from 'react-validation/build/form';
import Select from 'react-validation/build/select';
import Button from 'react-validation/build/button';
import Textarea from 'react-validation/build/textarea';
import { Scheduler } from 'devextreme-react';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.compact.css';
import axios from 'axios';
import querystring from 'querystring';

axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded, x-xsrf-token';

import DxTable from './dx_table';
import './my_styles.css'
import './schedule_style.css'


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
        new_note: '',
        new_client: '',
        new_client_id: '',
        new_start: '',
        new_finish: '',
        new_doctor: '',
        new_doctor_id: null,
        open: false,
    };

    onChange = (event) => {
        if (event.target.name === 'new_doctor') {
            const selectedIndex = event.target.options.selectedIndex;
            this.setState({
                new_doctor_id: event.target.options[selectedIndex].getAttribute('data-key'),
                new_doctor: event.target.options[selectedIndex].getAttribute('value'),
            });
        }
        else {
            this.setState({[event.target.name]:event.target.value});
        }
    };

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
        console.log('asd');
    };

    changeVisit = (e) => {
        console.log(e);
    };

    onRowClick = (row) => {
        this.setState({
            new_client_id: row.id,
            new_client: row.name,
        })
    };

    // показує форму нового візиту, записує в state обраний час
    cellClick = (e) => {
        if (e.cellData) { // клацнули пусту ячейку:
            this.setState({
                open: true,
                new_start: e.cellData.startDate,
                new_finish: e.cellData.endDate,
            })
        }
    };

    // закриває форму, очищує поля
    closeForm = () => {
        this.setState({
            open: false,
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
            <Fragment>
                <Scheduler
                    id='scheduler'
                    dataSource={this.state.visits}
                    height={'auto'}
                    editing={false}
                    views={[
                        { name: "День", type: "day", startDate: new Date() },
                        { name: "Тиждень", type: "week", startDate: new Date() },
                        { name: "2 тижні", type: "workWeek", intervalCount: 2, startDate: new Date() },
                    ]}
                    defaultCurrentView={'week'}
                    defaultCurrentDate={new Date()}
                    startDayHour={8}
                    endDayHour={21}
                    firstDayOfWeek={1}
                    cellDuration={60}
                    showAllDayPanel={false}
                    onCellClick={this.cellClick}
                    onAppointmentDblClick={this.changeVisit}
                    shadeUntilCurrentTime={true}
                    crossScrollingEnabled={true} // щоб працювало css
                />

                <Modal onClose={this.closeForm} open={this.state.open}>
                    <div className='css_half_width'>
                        <Form onSubmit={this.addVisit}>
                            <div className='font-weight-bold'>Новий візит</div>
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
                                <Textarea className="css_full_width" value={this.state.new_note} name='new_note' onChange={this.onChange} maxLength={500}/>
                            </label> <br />

                            <label className="css_full_width">Доктор:
                                <Select id='doctor_select' name='new_doctor' className="full_width" value={this.state.new_doctor} onChange={this.onChange}>
                                    <option data-key={0} value='Не внесено'>------------</option>
                                    {
                                        window.doctors.map(doctor => {
                                            return <option key={doctor.id} data-key={doctor.id}
                                                value={doctor.name}>{doctor.name}</option>;
                                        })
                                    }
                                </Select>
                            </label>

                            <Button className='float-sm-right btn btn-outline-secondary'>Підтвердити</Button>
                        </Form>
                    </div>
                </Modal>
            </Fragment>
        )
    }
}

ReactDOM.render(
    <Schedule />,
    document.getElementById('schedule')
);