import { Comment, Avatar, Skeleton, Tooltip, Input } from "antd";
import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import doRequest from '../../../interface/useRequests';
import moment from 'moment';
import styles from './styles.module.css'

const ExampleComment = (props: any) => {
    const [isExpand, handleChangeExpand] = useState(false);
    const [comments, handleChangeComments] = useState([]);
    const [isReply, handleChangeReply] = useState(false);
    const [isReplyIn, handleChangeReplyIn] = useState(false);
    const [content, handleChangeContent] = useState('');
    const [replyid, handleChangeReplyid] = useState(undefined);
    const [replyname, handleChangeReplyname] = useState(undefined);
    function onClickExpand() {
        if (comments.length > 0) handleChangeExpand(!isExpand);
        let params = { url: `/reply/comment/?replyid=${props.reply.replyid}` };
        doRequest(params).then(result => { handleChangeComments(result.data); handleChangeExpand(!isExpand); });
    }
    function onClickReply(root = true, replyname = undefined, replyid = undefined) {
        if (root) return handleChangeReply(!isReply);
        handleChangeContent('回复 @' + replyname + ' : ')
        handleChangeReplyIn(!isReplyIn);
        handleChangeReplyid(replyid);
        handleChangeReplyname(replyname);
    }
    async function onSubmit() {
        let params:any = {replyid: props.reply.replyid};
        if(replyid) params.replyuserid = replyid;
        if(replyname) params.content = content.replace('回复 @' + replyname + ' : ','');
        await doRequest({
            url: `/reply/comment/`,params,type: 'POST',needAuth:true,
        }).then(error => console.log(error));
        params = { url: `/reply/comment/?replyid=${props.reply.replyid}` };
        doRequest(params).then(result => { handleChangeComments(result.data); handleChangeReplyIn(!isReplyIn); });
    }
    const Reply = (props: any) => (
        <>回复 <span className={styles.replyname}>@{props.name}</span> :  </>
    )
    const { TextArea } = Input;
    return (
        <Comment
            actions={
                [<span onClick={onClickExpand} key="comment-nested-reply-to">{isExpand ? '收起' : '展开'}评论({props.reply.commentCount})</span>,
                <span onClick={() => onClickReply()} key="comment-nested-reply-to">回复</span>,
                <span style={isReply ? {} : { display: 'none' }} onClick={onSubmit} key="comment-nested-reply-to">确认回复</span>]
            }
            author={<a>{props.reply.username}</a>}
            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt={""} />}
            datetime={
                <Tooltip title={moment(props.reply.createtime).format('YYYY-MM-DD HH:mm:ss')}>
                    <span>{moment(props.reply.createtime).fromNow()}</span>
                </Tooltip>
            }
            content={
                <p>
                    {props.reply.content}
                </p>
            }
        >
            {isReply && <TextArea value={content} rows={2} onChange={e => handleChangeContent(e.target.value)} placeholder="输入最大字符30" maxLength={30} />}
            {isExpand && comments.map((item: any) => (
                <Comment
                    actions={
                        [<span onClick={() => onClickReply(false, item.username,item.userid)} key="comment-nested-reply-to">回复</span>,
                        <span style={isReplyIn ? {} : { display: 'none' }} onClick={onSubmit} key="comment-nested-reply-to">确认回复</span>]
                    }
                    author={<a>{item.username}</a>}
                    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt={""} />}
                    datetime={
                        <Tooltip title={moment(item.createtime).format('YYYY-MM-DD HH:mm:ss')}>
                            <span>{moment(item.createtime).fromNow()}</span>
                        </Tooltip>
                    }
                    content={
                        <p>
                            {item.replyname && <Reply name={item.replyname} />} {item.content}
                        </p>
                    }
                ></Comment>))}
            {isReplyIn && <TextArea value={content} rows={2} onChange={e => handleChangeContent(e.target.value)} placeholder="输入最大字符30" maxLength={30} />}
        </Comment>
    )
};

class ReplyComment extends React.Component<any, any>{

    constructor(props: any) {
        super(props);
        this.state = { replys: [], comments: {}, loading: true }
    }

    componentDidMount() {
        this.init();
    }

    init() {
        let params = { url: `/reply/comment/?problemid=${this.props.problemid}` };
        doRequest(params)
            .then((result: { data: any; }) => this.setState({ replys: result.data, loading: false }), () => console.log(this.state))
            .catch((error: any) => console.error(error));
    }

    render() {
        const { loading, replys,} = this.state;
        if (loading) return <Skeleton avatar paragraph={{ rows: 4 }} />
        return (
            <>
                {replys.map((item: any) => <ExampleComment reply={item} />)}
            </>
        )
    }
}

export default withRouter(ReplyComment)