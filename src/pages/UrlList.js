import React from 'react';
import {Input} from "antd";
import {getUrlList} from "../utils/db";

export default class UrlList extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            urlList: ''
        }
    }

    componentDidMount() {
        let s = '';
        getUrlList().map(item => {
            s += item+'\n';
        });
        this.setState({
            urlList: s
        })
    }

    render() {
        return (
            <div>
                <Input.TextArea
                    value={this.state.urlList}
                    autoSize
                    onChange={text => {
                        console.log(text.target.value.split('\n'));
                        this.setState({

                        })
                    }}
                />
            </div>
        );
    }
}
