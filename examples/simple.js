import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import SimpleSheet from 'rc-simple-sheet';
import 'rc-simple-sheet/assets/index.less';

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectionCell: [],
      value: [
        {
          row: '4',
          column: '5',
          render: ({ record, row, column }) => {
            // eslint-disable-next-line
            console.log('record', record, 'row', row, 'column', column);
            return (<div>value</div>);
          },
        },
        {
          row: '2',
          column: '2',
          render: () => {
            return (<div>value</div>);
          },
        },
      ],
    };
  }

  render() {
    const rowArr = [];
    let i = 1;
    while (21 > i) {
      rowArr.push(i);
      i += 1;
    }
    const sheetProps = {
      rows: rowArr.map((elem, index) => {
        return {
          label: elem,
          index: `${index}`,
        };
      }),
      columns: 'ABCDEFG'.split('').map((elem, index) => {
        return {
          label: elem,
          index: `${index}`,
        };
      }),
      rowHeight: 30,
      headerHeight: 30,
      rowSelectClassName: 'custom-row-cell-selected',
      selectionCell: this.state.selectionCell,
      value: this.state.value,
      onChange: (value) => {
        this.setState({
          value,
        });
      },
      onSelectionCellChange: (selectionCell) => {
        this.setState({
          selectionCell,
        });
      },
    };
    return (<div>
      <div style={{ width: '100%', margin: '100px auto', textAlign: 'center' }}>
        <h1>{'props: rowHeight={40}'}</h1>
        <SimpleSheet {...sheetProps} rowHeight={40} />

        <h1>{'props: xSelect={false} cellWidth={30} labelCellWidth={30}'}</h1>
        <SimpleSheet {...sheetProps} xSelect={false} cellWidth={30} labelCellWidth={30} />

        <h1>{'props: ySelect={false} cellWidth={50} labelCellWidth={30}'}</h1>
        <SimpleSheet {...sheetProps} ySelect={false} cellWidth={50} labelCellWidth={30} />
      </div>
    </div>);
  }
}

ReactDOM.render(<Test />, document.getElementById('__react-content'));
