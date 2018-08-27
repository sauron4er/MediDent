// Компонент-обгортка над компонентом DevExtreme React Grid
// https://devexpress.github.io/devextreme-reactive/react/grid/docs/guides/getting-started/

import React from 'react';
import Paper from '@material-ui/core/Paper';
import {Grid, Table, TableHeaderRow, TableFilterRow, PagingPanel, TableEditRow, TableEditColumn,} from '@devexpress/dx-react-grid-material-ui';
import { PagingState, SortingState, FilteringState, IntegratedSorting, IntegratedFiltering, IntegratedPaging, } from '@devexpress/dx-react-grid';
import { EditingState } from '@devexpress/dx-react-grid';

const styles = {
      true: { // Колір рядка червоний, якщо заданий рядок == 'true'
            backgroundColor: '#ff6968'
        },
    };

const getRowId = row => row.id;



class MyTable extends React.Component {
    constructor(props) {
        super(props);

        this.commitChanges = this.commitChanges.bind(this);

        this.state = {
            rows: this.props.rows
        };
    }

    commitChanges({ added, changed, deleted }) {
        let { rows } = this.state;
        if (added) {
          const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
          rows = [
            ...rows,
            ...added.map((row, index) => ({
              id: startingAddedId + index,
              ...row,
            })),
          ];
        }
        if (changed) {
          rows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
        }
        if (deleted) {
          const deletedSet = new Set(deleted);
          rows = rows.filter(row => !deletedSet.has(row.id));
        }
        this.setState({ rows });
      }


    // Стилі рядків
    ChooseStyle(row) {
        if (this.props.redRow) {
            switch(this.props.redRow){
                case 'is_vacant':
                    return {
                        cursor: 'pointer',
                        ...styles[row.is_vacant],
                    };
                default:
                    return {cursor: 'pointer',};
            }
        }
        return {cursor: 'pointer', }
    }

    // внутрішні настройки рядка ReactGrid
    TableRow = ({ row, ...restProps }) => (
      <Table.Row
        {...restProps}
        // eslint-disable-next-line no-alert
        onClick={() => this.onRowClick(row)}
        style={this.ChooseStyle(row)}
      />
    );

    // передача інфу про клікнутий рядок наверх
    onRowClick(row) {
        const onRowClick = this.props.onRowClick;
        onRowClick(row)
    }

    render() {
        return (
            <Paper className="mt-2">
                <Grid
                        rows={this.props.rows}
                        columns={this.props.columns}
                        getRowId={getRowId} >

                    <EditingState
                        onCommitChanges={this.commitChanges}
                    />
                    <SortingState
                        defaultSorting={this.props.defaultSorting}
                    />
                    <PagingState />
                    <FilteringState />
                    <IntegratedFiltering />
                    <IntegratedSorting />
                    <IntegratedPaging />
                    <Table rowComponent={this.TableRow} columnExtensions={this.props.colWidth} messages={{noData: 'Немає даних',}} />
                    <TableHeaderRow showSortingControls />

                    {/*Якщо в props є edited - таблиця дає можливість редагувати рядки*/}
                    <If condition={this.props.edited}>
                        <TableEditRow
                            rowHeight={100}
                        />
                        <TableEditColumn
                            width={220}
                            messages={{
                                addCommand: 'Додати',
                                editCommand: 'Редагувати',
                                deleteCommand: 'Видалити',
                                commitCommand: 'Зберегти',
                                cancelCommand: 'Відмінити',
                            }}
                            showAddCommand
                            showEditCommand
                            showDeleteCommand
                        />
                    </If>

                    {/*Таблиця не дає можливість фільтрувати, якщо отримала noFilter в props */}
                    <If condition={this.props.filter}>
                        <TableFilterRow messages={{filterPlaceholder: 'Фільтр...',}} />
                    </If>

                    <PagingPanel
                    allowedPageSizes={[0, 5, 10, 20]}
                    messages={{
                        showAll: 'Усі',
                        rowsPerPage: 'Записів на сторінці',
                        info: 'Записи з {from} по {to} (всього {count})',
                    }}
                    />
                </Grid>
            </Paper>
        )
    }
}

export default MyTable;
