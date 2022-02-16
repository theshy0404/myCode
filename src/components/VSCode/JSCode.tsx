import React from 'react';
import styles from './Code.module.css';
import { Button, Space } from 'antd';
import { CheckOutlined, SendOutlined } from '@ant-design/icons';
import axios from 'axios';

type TState = {
  codeLines: Array<{ code: string, isEditable: boolean }>;
  input: string;
  output: number | string;
  word: string;
  isHasError: boolean;
  positionTop?: number;
  positionLeft?: number;
  words: Array<string>;
  selectTip?: number;
  loading: boolean;
};

const keyWords = ['return', 'const', 'let', 'of', 'for', 'in', 'undefined', 'null'];

const globalWords = ['document', 'console', 'log', 'window'];

const tipWords = [...keyWords, ...globalWords];

class VSCode extends React.Component<any, TState>{
  constructor(props: any) {
    super(props);
    this.state = {
      codeLines: [
        { code: 'function (nums,target) {', isEditable: false },
        { code: '\t', isEditable: true },
        { code: '}', isEditable: false },
      ],
      input: '[1, 2]',
      output: '',
      word: '',
      isHasError: false,
      words: [],
      loading: false,
    }
  }

  componentDidMount() {
    const lines = this.state.codeLines;
    lines.some((item, index) => {
      if (!item.isEditable) return false;
      document.getElementById('line' + index)?.focus();
      return true;
    })
  }

  static getDerivedStateFromError() {
    return { isHasError: true };
  }

  handleChangeEditLine(selectIndex: number): void {
    const lines = this.state.codeLines;
    this.setState({
      codeLines: lines.map((item, index) => {
        if (selectIndex === index) {
          return { ...item, isEditable: true }
        }
        return { ...item, isEditable: false }
      })
    }, () => document.getElementById('line' + selectIndex)?.focus())
  }

  handleLineEnter(event: any, lineIndex: number): void {
    const { keyCode } = event;
    let { codeLines, word, selectTip, words } = this.state;
    if (event.keyCode === 38) {
      return this.setState({ selectTip: selectTip && selectTip - 1 >= 0 ? selectTip - 1 : 0 })
    }
    if (event.keyCode === 40) {
      if (selectTip !== undefined && selectTip >= 0 && selectTip < words.length - 1) {
        return this.setState({ selectTip: ++selectTip })
      }
      if (selectTip !== undefined && selectTip === words.length - 1) {
        return this.setState({ selectTip: words.length - 1 })
      }
    }
    if (event.keyCode >= 65 && event.keyCode <= 90) {
      return this.setState({ word: word += event.key, words: tipWords.filter(item => item.indexOf(word) !== -1), selectTip: 0 });
    }
    if (keyCode === 13) {
      if (selectTip !== undefined && selectTip >= 0 && selectTip < words.length) {
        codeLines[lineIndex].code = codeLines[lineIndex].code.replace(new RegExp(word + '$'), words[selectTip]);
        return this.setState({ word: '', codeLines, selectTip: undefined });
      }
      codeLines[lineIndex].isEditable = false;
      codeLines.splice(lineIndex + 1, 0, { code: '\t', isEditable: true });
      return this.setState({
        codeLines, word: ''
      }, () => document.getElementById('line' + (lineIndex + 1))?.focus());
    }
    if (keyCode === 8 && codeLines[lineIndex].code === '') {
      codeLines.splice(lineIndex, 1);
      codeLines[lineIndex - 1].isEditable = true;
      return this.setState({
        codeLines, word: ''
      }, () => document.getElementById('line' + (lineIndex - 1))?.focus());
    }
    if (keyCode === 8 && word !== '') {
      return this.setState({ word: word.slice(0, word.length - 1) })
    }
    return this.setState({ word: '', selectTip: undefined });
  }

  handleChangeLineValue(event: any, lineIndex: number): void {
    const { codeLines } = this.state;
    codeLines[lineIndex] = { code: event.target.value, isEditable: true }
    const changeLine = document.getElementById('line' + lineIndex);
    if (changeLine) {
      const positionTop = changeLine.offsetTop + changeLine.offsetHeight;
      const positionLeft = changeLine.offsetLeft + 20 + event.target.value.length * 7.04;
      return this.setState({
        codeLines, positionTop, positionLeft
      });
    }
    this.setState({
      codeLines
    });
  }

  include(val: string): boolean {
    for (let word of tipWords) {
      if (word.indexOf(val) !== -1) return true;
    }
    return false;
  }

  run(): void {
    this.setState({ loading: true });
    let code = '';
    const func = 'sum';
    const language = 'javascript';
    const input = '2,1';
    for (let line of this.state.codeLines) {
      code += line.code.replace('\t', '');
    }
    axios.post('http://127.0.0.1:5000/problem/runJS', {
      params: {
        code, func, language, input
      }
    }).then(res => console.log(res))
      .catch(err => console.log(err))
      .finally(() => this.setState({ loading: false }));
  }

  render() {
    const lines = this.state.codeLines;
    const selectIndex = lines.findIndex(item => item.isEditable);
    const { positionTop, loading, positionLeft, word, words, selectTip } = this.state;
    const createMarkup = (code: string): { __html: string } => {
      let innerHTML = '';
      for (let i = 0; i < code.length; i++) {
        const char = code.charAt(i);
        innerHTML += char === '\t' ? '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' : char
      }
      return { __html: innerHTML };
    }
    return (
      <div className={styles.wrap}>
        <div className={styles.codeTips} style={{ position: 'absolute', top: positionTop, left: positionLeft, display: word !== '' && this.include(word) ? 'block' : 'none' }}>
          {words.map((item, index) =>
            <div data-select={selectTip === index} key={index} className={styles.tipWord}>{item}</div>
          )}
        </div>
        <div className={styles.codeWrap}>
          <div className={styles.codeIndex}>
            {lines.map((item, index) => <div data-select={index === selectIndex} key={index} className={styles.index}>{index}</div>)}
          </div>
          <div className={styles.codeContent}>
            {lines.map((item, index) => {
              return item.isEditable ?
                <input autoComplete="off" onChange={event => this.handleChangeLineValue(event, index)} onKeyUp={event => this.handleLineEnter(event, index)} id={'line' + index} key={index} className={styles.line} value={item.code}></input> :
                <div onClick={() => this.handleChangeEditLine(index)} key={index} className={styles.line} dangerouslySetInnerHTML={createMarkup(item.code)}></div>
            })}
          </div>
        </div>
        <div className={styles.footer}>
          <Space size="large">
            <Button type="primary" onClick={() => this.run()} loading={loading} ghost icon={<SendOutlined />}>执行代码</Button>
            <Button type="primary" icon={<CheckOutlined />}>完成</Button>
          </Space>
        </div>
      </div>
    );
  }
}

export default VSCode;
