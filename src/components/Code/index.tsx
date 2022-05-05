import React from 'react';
import styles from './styles.module.css';
import MonacoEditor from 'react-monaco-editor';
import { Button, Space } from 'antd';

const languageMap = {
    '3': 'javascript',
    '2': 'python',
    '4': 'mysql',
}

class Code extends React.Component<any, any>{
    constructor(props: any) {
        super(props);
        this.state = {
            code: props.language === 4 ?
                '/* write your code... */'
                : 'function ' + this.props.func + '(' + this.props.arguements + '){\n\t//write your code...\n}',
        };
        this.onChange = this.onChange.bind(this);
    }
    componentWillReceiveProps(nextProps: any) {
        if (nextProps.language == 3) this.setState({ code: 'function ' + nextProps.func + '(' + nextProps.arguements + '){\n\t//write your code...\n}' });  // eslint-disable-line
        else if (nextProps.language == 2) this.setState({ code: 'def ' + nextProps.func + '(' + nextProps.arguements + '):\n\t# write your code...' });  // eslint-disable-line
        else if (nextProps.language == 4) this.setState({ code: '/* write your code... */' });  // eslint-disable-line
    }
    editorDidMount(editor: any, monaco: any) {
        editor.focus();
    }
    onChange(code: any, e: any) {
        this.setState({ code })
    }
    render() {
        const code = this.state.code;
        const options = {
            selectOnLineNumbers: true
        };
        return (
            <>

                <MonacoEditor
                    width="800"
                    height="600"
                    language={languageMap[this.props.language]}
                    theme="vs-dark"
                    value={code}
                    options={options}
                    onChange={this.onChange}
                    editorDidMount={this.editorDidMount}
                />
                <div className={styles.footer}>
                    <Space size="large">
                        <Button onClick={() => this.props.doRun(code)} >执行代码</Button>
                        <Button type="primary" onClick={() => this.props.doSubmit(code)} >提交</Button>
                    </Space>
                </div>
            </>
        );
    }
}

export default Code;