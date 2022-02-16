import React from 'react'
import { Spin } from 'antd'

function asyncComponent(loadComponent: () => Promise<any>) {
    class AsyncComponent extends React.Component<any, any> {
        static defaultProps = {
            loading: <Spin style={{position: 'absolute',left: '45%',top: '200px'}} tip="Loading...">
            </Spin>,
            error: <p>Some Error...</p>
        }
        constructor(props: any) {
            super(props)
            this.load = this.load.bind(this)
            this.state = {
                module: null
            }
        }

        componentWillMount() {
            this.load(this.props)
        }

        load(props: any) {
            this.setState({
                module: props.loading
            })
            loadComponent()
                .then(m => {
                    let Module = m.default ? m.default : m
                    this.setState({
                        module: <Module {...props} />
                    })
                }).catch((error) => {
                    this.setState({
                        module: props.error
                    })
                    console.log(error)
                })
        }
        render() {
            return this.state.module;
        }
    }

    return AsyncComponent
}

export default asyncComponent;