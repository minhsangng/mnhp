import { Table } from "antd";

export default function Employee() {
    const dataSource = [
        {
            key: '1',
            name: 'Mike',
            age: 32,
            address: '10 Downing Street',
        },
        {
            key: '2',
            name: 'John',
            age: 42,
            address: '10 Downing Street',
        },
    ];

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
    ];

    return (
        <div className="px-8">
            <h1 className="text-(--primary-color) text-2xl pt-6">Danh sách giáo viên</h1>
            <div className="mt-4 border-(--border) bg-(--bg) shadow rounded-lg p-4">
                <Table dataSource={dataSource} columns={columns} />
            </div>
        </div>
    );
}