import expect from 'expect.js';
import React from 'react';
import { findDOMNode, render, unmountComponentAtNode } from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import $ from 'jquery';
import async from 'async';

import SimpleSheet from '../index';

import '../assets/index.less';

const timeout = (ms) => {
  return (done) => {
    setTimeout(done, ms);
  };
};

const expectQueryLength = (component, query, length) => {
  const componentDomNode = findDOMNode(component);
  const findLength = $(componentDomNode).find(query).length;
  expect(findLength).to.be(length);
};

const verifyExist = (component, query, content, done) => {
  async.series([timeout(20), (next) => {
    expectQueryLength(component, query, content);
    next();
  }, timeout(20), (next) => {
    next();
  }], done);
};

const expectPopupToHaveContent = (component, query, content) => {
  const componentDomNode = findDOMNode(component);
  const htmlContent = $(componentDomNode).find(query).html().trim();
  // eslint-disable-next-line
  // console.log('htmlContent', htmlContent, 'content', content);
  expect(htmlContent).to.be(content);
};

const verifyContent = (component, query, content, done) => {
  async.series([timeout(20), (next) => {
    expectPopupToHaveContent(component, query, content);
    next();
  }, timeout(20), (next) => {
    next();
  }], done);
};

describe('rc-simple-sheet', () => {
  let div;
  before(() => {
    timeout(40000);
    div = document.createElement('div');
    div.style.margin = '100px';
    document.body.insertBefore(div, document.body.firstChild);
  });

  afterEach(() => {
    unmountComponentAtNode(div);
  });

  describe('check default props', () => {
    it('topLeftCell', (done) => {
      const simpleSheet = render(<SimpleSheet key="default_props_test_1" className="custom-rc-simple-sheet" />, div);
      const prefixCls = simpleSheet.props.prefixCls;
      verifyContent(simpleSheet, `.${prefixCls}-header-row-cell-label:first-child`, '', done);
    });
    it('header cell 1', (done) => {
      const simpleSheet = render(<SimpleSheet key="default_props_test_2" className="custom-rc-simple-sheet" />, div);
      const prefixCls = simpleSheet.props.prefixCls;
      verifyContent(simpleSheet, `.${prefixCls}-header-row-cell-label:nth-child(2)`, '1', done);
    });
    it('header cell 2', (done) => {
      const simpleSheet = render(<SimpleSheet key="default_props_test_3" className="custom-rc-simple-sheet" />, div);
      const prefixCls = simpleSheet.props.prefixCls;
      verifyContent(simpleSheet, `.${prefixCls}-header-row-cell-label:nth-child(3)`, '2', done);
    });
    it('row cell length default 3', (done) => {
      // this must not exist
      const simpleSheet = render(<SimpleSheet key="default_props_test_4" className="custom-rc-simple-sheet" />, div);
      const prefixCls = simpleSheet.props.prefixCls;
      verifyExist(simpleSheet, `.${prefixCls}-header-row-cell-label`, 3, done);
    });
    it('row cell 1', (done) => {
      const simpleSheet = render(<SimpleSheet key="default_props_test_5" className="custom-rc-simple-sheet" />, div);
      const prefixCls = simpleSheet.props.prefixCls;
      verifyContent(simpleSheet, `.${prefixCls}-row:nth-child(2) .${prefixCls}-row-cell`, '1', done);
    });
    it('row cell 2', (done) => {
      const simpleSheet = render(<SimpleSheet key="default_props_test_6" className="custom-rc-simple-sheet" />, div);
      const prefixCls = simpleSheet.props.prefixCls;
      verifyContent(simpleSheet, `.${prefixCls}-row:nth-child(3) .${prefixCls}-row-cell`, '2', done);
    });
    it('row length default 3', (done) => {
      // this must not exist
      const simpleSheet = render(<SimpleSheet key="default_props_test_7" className="custom-rc-simple-sheet" />, div);
      const prefixCls = simpleSheet.props.prefixCls;
      verifyExist(simpleSheet, `.${prefixCls}-row`, 3, done);
    });

    it('click one cell', (done) => {
      // this must not exist
      const simpleSheet = render(<SimpleSheet key="default_props_test_7" className="custom-rc-simple-sheet" />, div);
      const prefixCls = simpleSheet.props.prefixCls;
      const mouseDownCell = $(`.${prefixCls}-row:nth-child(2) .${prefixCls}-row-cell:nth-child(2)`);
      Simulate.mouseDown(findDOMNode(mouseDownCell[0]));
      Simulate.mouseUp(findDOMNode(mouseDownCell[0]));
      // eslint-disable-next-line
      // console.log(JSON.stringify(simpleSheet.state.selectionCell));
      expect(JSON.stringify(simpleSheet.state.selectionCell)).to.be(JSON.stringify([{ row: 1, column: 1 }]));
      done();
    });

    it('drag cell', (done) => {
      // this must not exist
      const simpleSheet = render(<SimpleSheet key="default_props_test_7" className="custom-rc-simple-sheet" />, div);
      const prefixCls = simpleSheet.props.prefixCls;
      const mouseDownCell = $(`.${prefixCls}-row:nth-child(2) .${prefixCls}-row-cell:nth-child(2)`);
      const mouseMoveCell = $(`.${prefixCls}-row:nth-child(3) .${prefixCls}-row-cell:nth-child(3)`);
      Simulate.mouseDown(findDOMNode(mouseDownCell[0]));
      Simulate.mouseOver(findDOMNode(mouseMoveCell[0]));
      Simulate.mouseUp(findDOMNode(mouseMoveCell[0]));
      // eslint-disable-next-line
      // console.log(JSON.stringify(simpleSheet.state.selectionCell));
      expect(JSON.stringify(simpleSheet.state.selectionCell)).to.be(JSON.stringify([{ row: 1, column: 1 }, { row: 1, column: 2 }, { row: 2, column: 1 }, { row: 2, column: 2 }]));
      done();
    });
  });

  describe('check columns props', () => {
    const columns = [
      {
        label: 'A',
        index: 1,
      },
      {
        label: 'B',
        index: 2,
      },
      {
        label: 'C',
        index: 3,
      },
      {
        label: 'D',
        index: 4,
      },
      {
        label: 'E',
        index: 5,
      },
    ];
    it('header cell 1', (done) => {
      const simpleSheet = render(<SimpleSheet columns={columns} key="columns_props_test_2" className="custom-rc-simple-sheet" />, div);
      const prefixCls = simpleSheet.props.prefixCls;
      verifyContent(simpleSheet, `.${prefixCls}-header-row-cell-label:nth-child(2)`, 'A', done);
    });
    it('header cell 2', (done) => {
      const simpleSheet = render(<SimpleSheet columns={columns} key="columns_props_test_3" className="custom-rc-simple-sheet" />, div);
      const prefixCls = simpleSheet.props.prefixCls;
      verifyContent(simpleSheet, `.${prefixCls}-header-row-cell-label:nth-child(3)`, 'B', done);
    });
    it('header cell length', (done) => {
      // this must not exist
      const simpleSheet = render(<SimpleSheet columns={columns} key="columns_props_test_4" className="custom-rc-simple-sheet" />, div);
      const prefixCls = simpleSheet.props.prefixCls;
      verifyExist(simpleSheet, `.${prefixCls}-header-row-cell-label`, columns.length + 1, done);
    });
  });

  describe('check rows props', () => {
    const rows = [
      {
        label: 'A',
        index: 1,
      },
      {
        label: 'B',
        index: 2,
      },
      {
        label: 'C',
        index: 3,
      },
      {
        label: 'D',
        index: 4,
      },
      {
        label: 'E',
        index: 5,
      },
    ];
    it('rows cell 1', (done) => {
      const simpleSheet = render(<SimpleSheet rows={rows} key="row_props_test_2" className="custom-rc-simple-sheet" />, div);
      const prefixCls = simpleSheet.props.prefixCls;
      verifyContent(simpleSheet, `.${prefixCls}-row:nth-child(2) .${prefixCls}-row-cell`, 'A', done);
    });
    it('rows cell 2', (done) => {
      const simpleSheet = render(<SimpleSheet rows={rows} key="row_props_test_3" className="custom-rc-simple-sheet" />, div);
      const prefixCls = simpleSheet.props.prefixCls;
      verifyContent(simpleSheet, `.${prefixCls}-row:nth-child(3) .${prefixCls}-row-cell`, 'B', done);
    });
    it('rows cell length', (done) => {
      // this must not exist
      const simpleSheet = render(<SimpleSheet rows={rows} key="row_props_test_4" className="custom-rc-simple-sheet" />, div);
      const prefixCls = simpleSheet.props.prefixCls;
      verifyExist(simpleSheet, `.${prefixCls}-row`, rows.length + 1, done);
    });
  });

  // describe('check value and on change props', () => {
  //   it('init', (done) => {
  //     const numberKeyboard = render(<SimpleSheet key="value_test_1" className="test-phone-keyboard" />, div);
  //     verifyContent(numberKeyboard, '000-0000-0000', done);
  //   });

  //   // it('props value', (done) => {
  //   //   const value = `${parseInt(Math.random() * 10000000000, 10)}`;
  //   //   const valueFormat = formatPhone(value);
  //   //   const numberKeyboard = render(<SimpleSheet key="value_test_2" value={value} />, div);
  //   //   verifyContent(numberKeyboard, valueFormat, done);
  //   // });

  //   // it('props onChange', (done) => {
  //   //   const testClick = () => {
  //   //     let countValue = parseInt(Math.random() * 10000, 10);
  //   //     let pastValue = formatPhone(countValue);
  //   //     const pastOnChange = (value) => {
  //   //       pastValue = value;
  //   //     };
  //   //     const numberKeyboard = render(<SimpleSheet key="value_test_3" onChange={pastOnChange} value={pastValue} />, div);
  //   //     const componentDomNode = findDOMNode(numberKeyboard);
  //   //     for (let clickTime = 8; clickTime -= 1;) {
  //   //       const row = parseInt(Math.random() * 4, 10);
  //   //       const col = parseInt(Math.random() * 3, 10);
  //   //       const tdElem = $(componentDomNode)
  //   //         .find('tr')
  //   //         .eq(row)
  //   //         .find('td')
  //   //         .eq(col);
  //   //       if (4 === row || 3 === col) {
  //   //         // 超出了键盘，不管
  //   //       }
  //   //       else {
  //   //         Simulate.click(findDOMNode(tdElem[0]));
  //   //         if (3 === row && 2 === col) {
  //   //           countValue = `${countValue}`.substring(0, `${countValue}`.length - 1);
  //   //         }
  //   //         else if (3 === row && 1 === col) {
  //   //           countValue = `${countValue}0`.substring(0, 11);
  //   //         }
  //   //         else if (3 === row && 0 === col) {
  //   //           // 这个没绑定点击动作。
  //   //         }
  //   //         else {
  //   //           const value = ((row * 3) + (col + 1)) % 10;
  //   //           countValue = `${countValue}${value}`.substring(0, 11);
  //   //         }

  //   //       }
  //   //     }
  //   //   };
  //   //   for (let i = 30; i -= 1;) {
  //   //     testClick();
  //   //   }
  //   //   done();
  //   // });
  // });
});
