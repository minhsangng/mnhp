import { useState, useEffect } from "react";
import { Table } from "antd";
import Loading from "../components/Loading";
import type { TableColumnsType } from "antd";
import { createStyles } from "antd-style";
import { API_URL } from "../contants/api";
import axios from "axios";

const useStyle = createStyles(({ css }) => ({
    customTable: css`
    .ant-table {
      .ant-table-container {
        .ant-table-body,
        .ant-table-content {
          scrollbar-width: thin;
          scrollbar-color: #eaeaea transparent;
        }
      }
    }
    th,
    td {
      text-align: center;
      vertical-align: middle;
      font-family: "Qojarun", sans-serif;
      font-size: 1.15rem;
    }
  `,
}));

interface ChildFromAPI {
    id: number;
    full_name: string;
    class_id: number;
    birth_date: string;
    category: string;
    guardian_name: string;
    notes: string;
}

interface GroupedChild {
    class_id: number;
    class_name: string;
    childrens: ChildFromAPI[];
}

interface DataType {
    key: React.Key;
    index: number;
    name: string;
    dateOfBirth: string;
    object: string;
    parentName: string;
    note: string;
}

const Children = () => {
    const [loading, setLoading] = useState(false);
    const [groups, setGroups] = useState<GroupedChild[]>([]);
    const { styles } = useStyle();

    const fetchChildrens = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_URL}/childrens`);
            if (data.success) {
                setGroups(data.data);
            }
        } catch (error) {
            console.log("Error fetching childrens:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChildrens();
    }, []);

    const handleEdit = (id: React.Key) => {
        console.log("Edit id:", id);
    };

    const handleDelete = (id: React.Key) => {
        console.log("Delete id:", id);
    };

    const columns: TableColumnsType<DataType> = [
        { title: "STT", dataIndex: "index", key: "index", align: "center", width: 50 },
        { title: "Họ và tên bé", dataIndex: "name", key: "name", align: "center" },
        { title: "Ngày sinh", dataIndex: "dateOfBirth", key: "dateOfBirth", align: "center", width: 180 },
        { title: "Đối tượng", dataIndex: "object", key: "object", align: "center", width: 140 },
        { title: "Họ tên người giám hộ", dataIndex: "parentName", key: "parentName", align: "center" },
        { title: "Ghi chú", dataIndex: "note", key: "note", align: "center", width: 80 },
        {
            title: "",
            dataIndex: "action",
            key: "action",
            align: "center",
            render: (_, record) => (
                <div className="flex gap-2 justify-center">
                    <button
                        className="px-2 py-1 bg-blue-400 text-white! text-xl rounded cursor-pointer"
                        onClick={() => handleEdit(record.key)}
                    >
                        Sửa
                    </button>
                    <button
                        className="px-2 py-1 bg-red-400 text-white! text-xl rounded cursor-pointer"
                        onClick={() => handleDelete(record.key)}
                    >
                        Xóa
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="px-8 pb-2">
            <h1 className="text-(--primary-color) text-2xl pt-6 font-bold">Danh sách trẻ</h1>
            <div
                className={`my-4! mb-20 border-(--border) bg-(--bg) shadow rounded-lg p-4 ${loading ? "h-[calc(100vh-100px)]" : "h-auto"
                    }`}
            >
                {loading ? (
                    <Loading />
                ) : (
                    groups.map((group) => (
                        <div key={group.class_id} className="mb-8">
                            <h2 className="text-xl text-(--text-secondary) font-semibold mb-2">Lớp {group.class_name}</h2>
                            <Table<DataType>
                                className={styles.customTable}
                                columns={columns}
                                dataSource={group.childrens.map((child, idx) => ({
                                    key: child.id,
                                    index: idx + 1,
                                    name: child.full_name,
                                    dateOfBirth: new Date(child.birth_date).toLocaleDateString("vi-VN"),
                                    object: child.category,
                                    parentName: child.guardian_name,
                                    note: child.notes,
                                }))}
                                bordered
                                size="middle"
                                scroll={{ x: "auto" }}
                                pagination={{ pageSize: 10 }}
                            />
                        </div>
                    ))
                )}
            </div>

            <div className="flex justify-between items-center px-14 mt-10">
                <p className="text-center text-(--accent) italic text-sm m-0! border-t border-(--secondary-color) pt-2">
                    © Copyright 2025 | <a className="text-(--primary-color) underline" href="/">Mầm non Hồng Phúc</a> - All rights reserved.
                </p>
                <p className="text-center text-(--accent) italic text-sm m-0! border-t border-(--secondary-color) pt-2">
                    Designed by {" "}
                    <a className="text-(--primary-color) underline" href="#">
                        minhsang
                    </a>{"."}
                </p>
            </div>
        </div>
    );
};

export default Children;
