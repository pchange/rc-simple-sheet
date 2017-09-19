import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

class SimpleSheet extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.array,
    selectionCell: PropTypes.array,
    onSelectionCellChange: PropTypes.func,
    rows: PropTypes.array,
    columns: PropTypes.array,
    ySelect: PropTypes.bool,
    xSelect: PropTypes.bool,
    rowHeight: PropTypes.number,
    selectedAppend: PropTypes.bool,
    rowSelectClassName: PropTypes.string,
    cellWidth: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    labelCellWidth: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  };

  static defaultProps = {
    prefixCls: 'rc-simple-sheet',
    value: [],
    rows: [
      {
        label: 1,
        index: 1,
      },
      {
        label: 2,
        index: 2,
      },
    ],
    columns: [
      {
        label: 1,
        index: 1,
      },
      {
        label: 2,
        index: 2,
      },
    ],
    ySelect: true,
    xSelect: true,
    rowHeight: 30,
    selectedAppend: false,
    selectionCell: [],
    rowSelectClassName: '',
    cellWidth: 50,
    labelCellWidth: 50,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectionCell: props.selectionCell,
      value: props.value,
    };

    this.dragging = {
      ing: false,
      startRowIndex: 0,
      startColumnIndex: 0,
      endRowIndex: 0,
      endColumnIndex: 0,
    };

    this.countRowAndColumnIndexArr(props);

    this.handleGlobalMouseUp = this.handleRowCellMouseUp;
  }

  componentWillMount = () => {
    window.addEventListener('mouseup', this.handleGlobalMouseUp);
  }

  componentWillReceiveProps(nextProps) {
    const newState = {};
    if ('value' in nextProps) {
      newState.value = nextProps.value;
    }
    if ('selectionCell' in nextProps) {
      newState.selectionCell = nextProps.selectionCell;
    }

    this.countRowAndColumnIndexArr(nextProps);
    this.setState(newState);
  }

  componentWillUnmount = () => {
    window.removeEventListener('mouseup', this.handleGlobalMouseUp);
  }

  onChange = () => {
    const { onChange } = this.props;
    const { value } = this.state;
    if ('function' === typeof onChange) {
      onChange(value);
    }
  }

  onSelectionCellChange = () => {
    const { onSelectionCellChange } = this.props;
    const { selectionCell } = this.state;
    if ('function' === typeof onSelectionCellChange) {
      onSelectionCellChange(selectionCell);
    }
  }

  preventDefault = (e) => {
    e.preventDefault();
  }

  checkIsRepetition = (arr) => {
    return 0 < _.filter(this.rowIndexArr, function (value, index, iteratee) {
       return _.includes(iteratee, value, index + 1);
    }).length;
  }

  countRowAndColumnIndexArr = (props = this.props) => {
    this.rowIndexArr = _.map(props.rows, 'index');
    this.columnIndexArr = _.map(props.columns, 'index');

    if (this.checkIsRepetition(this.rowIndexArr) || this.checkIsRepetition(this.columnIndexArr)) {
      // eslint-disable-next-line
      console.error(`[${props.prefixCls}] row or column index must be unique, pleace check.`);
    }
  }

  countSelectionCell = ({ dragging = this.dragging }) => {
    if (dragging.ing) {
      const { startRowIndex: startRowIndexOrigin, startColumnIndex: startColumnIndexOrigin, endRowIndex: endRowIndexOrigin, endColumnIndex: endColumnIndexOrigin } = dragging;
      const startRowIndex = this.rowIndexArr.indexOf(startRowIndexOrigin);
      const startColumnIndex = this.columnIndexArr.indexOf(startColumnIndexOrigin);
      const endRowIndex = this.rowIndexArr.indexOf(endRowIndexOrigin);
      const endColumnIndex= this.columnIndexArr.indexOf(endColumnIndexOrigin);

      const rangeStartRowIndex = _.min([startRowIndex, endRowIndex]);
      const rangeStartColumnIndex = _.min([startColumnIndex, endColumnIndex]);
      const rangeEndRowIndex = _.max([startRowIndex, endRowIndex]);
      const rangeEndColumnIndex = _.max([startColumnIndex, endColumnIndex]);

      let selectionCell = [];
      if (this.props.selectedAppend) {
        selectionCell = this.state.selectionCell;
      }
      if (this.props.ySelect && !this.props.xSelect) {
        let rangeStartRowIndexCount = rangeStartRowIndex;
        while (rangeStartRowIndexCount <= rangeEndRowIndex) {
          const cellPosition = {
            row: this.rowIndexArr[rangeStartRowIndexCount],
            column: this.columnIndexArr[startColumnIndex],
          };
          selectionCell.push(cellPosition);
          rangeStartRowIndexCount += 1;
        }
      }
      else if (this.props.xSelect && !this.props.ySelect) {
        let rangeStartColumnIndexCount = rangeStartColumnIndex;
        while (rangeStartColumnIndexCount <= rangeEndColumnIndex) {
          const cellPosition = {
            row: this.rowIndexArr[startRowIndex],
            column: this.columnIndexArr[rangeStartColumnIndexCount],
          };
          selectionCell.push(cellPosition);
          rangeStartColumnIndexCount += 1;
        }
      }
      else if (this.props.xSelect && this.props.ySelect) {
        let rangeStartRowIndexCount = rangeStartRowIndex;
        while (rangeStartRowIndexCount <= rangeEndRowIndex) {
          let rangeStartColumnIndexCount = rangeStartColumnIndex;
          while (rangeStartColumnIndexCount <= rangeEndColumnIndex) {
            const cellPosition = {
              row: this.rowIndexArr[rangeStartRowIndexCount],
              column: this.columnIndexArr[rangeStartColumnIndexCount],
            };
            selectionCell.push(cellPosition);
            rangeStartColumnIndexCount += 1;
          }
          rangeStartRowIndexCount += 1;
        }
      }

      const uniqSelectionCell = _.uniqBy(selectionCell, (elem) => {
        return `(${elem.row}, ${elem.column})`;
      });
      this.setState({
        selectionCell: uniqSelectionCell,
      }, () => {
        this.onSelectionCellChange();
      });
    }
  }

  handleRowCellMouseOver = (e, { row, column }) => {
    this.preventDefault(e);
    this.dragging = {
      ...this.dragging,
      endRowIndex: row.index,
      endColumnIndex: column.index,
    };
    this.countSelectionCell({
      dragging: this.dragging,
    });
  }

  handleRowCellMouseUp = (e) => {
    this.preventDefault(e);
    this.dragging = {
      ing: false,
      startRowIndex: 0,
      startColumnIndex: 0,
      endRowIndex: 0,
      endColumnIndex: 0,
    };
  }

  handleRowCellMouseDown = (e, { row, column }) => {
    this.preventDefault(e);
    const cellPosition = {
      row: row.index,
      column: column.index,
    };
    e.target.addEventListener('mouseup', this.handleRowCellMouseUp);
    this.dragging = {
      ing: true,
      startRowIndex: row.index,
      startColumnIndex: column.index,
      endRowIndex: row.index,
      endColumnIndex: column.index,
    };
    let selectionCell = [];
    if (this.props.selectedAppend) {
      selectionCell = this.state.selectionCell;
    }
    if (_.find(selectionCell, cellPosition)) {
      _.remove(selectionCell, cellPosition);
    }
    else {
      selectionCell.push(cellPosition);
    }

    this.setState({
      selectionCell,
    }, () => {
      this.onSelectionCellChange();
    });
  }

  renderRowCell = ({ record, row, column }) => {
    if (record && record.render) {
      if ('string' === typeof record.render) {
        return record.render;
      }
      else if ('function' === typeof record.render) {
        return record.render({
          record,
          row,
          column,
        });
      }
      else {
        window.console.warn('week sheet value render should be string or function');
        return '';
      }
    }
    else {
      return null;
    }
  }

  render() {
    const props = this.props;
    const prefixCls = props.prefixCls;
    let className = props.prefixCls;
    if (props.className) {
      className += ` ${props.className}`;
    }
    const { selectionCell } = this.state;
    return (<div className={className} style={{ minWidth: (this.props.columns.length * this.props.cellWidth || 0) + (1 * this.props.labelCellWidth || 0)}}>
      <div style={{ height: this.props.rowHeight }} className={`${prefixCls}-row ${prefixCls}-clearfix`}>
        <div className={`${prefixCls}-row-cell ${prefixCls}-header-row-cell-label ${prefixCls}-row-label-cell`} style={{ width: this.props.labelCellWidth }} />
        {
          this.props.columns.map((column, index) => {
            return (<div key={index} style={{ width: this.props.cellWidth }} className={`${prefixCls}-row-cell ${prefixCls}-header-row-cell-label ${prefixCls}-row-cell-label`}>{column.label}</div>);
          })
        }
      </div>
      {
        this.props.rows.map((row) => {
          return (<div style={{ height: this.props.rowHeight }} className={`${prefixCls}-row ${prefixCls}-clearfix`} key={row.index}>
            <div style={{ width: this.props.labelCellWidth }} className={`${prefixCls}-row-cell ${prefixCls}-row-label-cell`}>{row.label}</div>
            {
              this.props.columns.map((column) => {
                const handleRowCellMouseDown = (e) => {
                  this.handleRowCellMouseDown(e, { row, column });
                };
                const handleRowCellMouseOver = (e) => {
                  this.handleRowCellMouseOver(e, { row, column });
                };
                const findRule = {
                  row: row.index,
                  column: column.index,
                };
                const isSelected = _.find(selectionCell, findRule);
                const record = _.find(this.state.value, findRule);
                const rowCellSelectedClassName = `${prefixCls}-row-cell-selected ${this.props.rowSelectClassName || ''}`;
                const className = `${isSelected ? rowCellSelectedClassName : ''} ${prefixCls}-row-cell`;
                return (<div
                  key={column.index}
                  style={{ width: this.props.cellWidth }}
                  className={className}
                  onMouseDown={handleRowCellMouseDown}
                  onMouseOver={handleRowCellMouseOver}
                  data-position={`(${row.index},${column.index})`}
                >
                  { this.renderRowCell({ record, row, column }) }
                </div>);
              })
            }
          </div>);
        })
      }
    </div>);
  }
}

export default SimpleSheet;
