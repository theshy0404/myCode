import { Table } from "antd";
import styles from './styles.module.css';

const MyTable = (props: any) => {
    const dataSource = props.results;

    const createColums = (dataSource: any[]) => {
        const colums: any[] = [];
        for (const key in dataSource[0]) {
            colums.push(
                {
                    title: key,
                    dataIndex: key,
                    key,
                },
            )
        }
        return colums;
    }

    const colums = createColums(dataSource);

    return (
        <div className={styles.wrap}>
            <Table pagination={false} size="small" bordered dataSource={dataSource} columns={colums} />
        </div>
    )
}

export default MyTable;