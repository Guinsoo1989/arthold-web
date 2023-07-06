import ProductList from "@/components/ProductList";
import React, { useState } from "react";
import styles from "./products.less";
import { useLocalStorageState, useMount } from "ahooks";
import { Button, Image, Input, Space, Table } from "antd";
import { MjApi } from "@/api/mjApi";
import { Task } from "@/type";
import { TimeUtil } from "@/util/TimeUtil";

const form = {
  text: "",
};

const id = "6284560417306491";

const jpg =
  "https://cdn.discordapp.com/attachments/1118933179361935526/1126021591222980608/guinsoo1998_dragon_dog_1272e7d1-4b19-4f72-8688-f876eaeae4e9.png";


export default function Page() {

  const [taskList, setTaskList] = useLocalStorageState<Task[]>('mj-task-list', {
    defaultValue: [],
  });


  useMount(async () => {
    if (!taskList?.length) {
      const task = await MjApi.getTaskById("6284560417306491");
      setTaskList([task])
    }

  });

  return (
    <div>
      <Space.Compact style={{ width: "100%" }}>
        <Input
          onChange={(e) => {
            form.text = e.currentTarget.value;
          }}
        />
        <Button
          type="primary"
          onClick={() => {
            console.log(666, form.text);
          }}
        >
          Submit
        </Button>
      </Space.Compact>

      <Table rowKey="id" dataSource={taskList} columns={
        [
          {
            title: "图片",
            render(_, row) {
              return (
                row.imageUrl
                // <Image
                //   width={200}
                //   src={row.imageUrl}
                // />
              )
            }
          },
          {
            title: "id",
            dataIndex: "id"
          },
          {
            title: "提示词",
            dataIndex: "prompt"
          },
          {
            title: "提交时间",
            render(_, row) {
              return (
                <span>{TimeUtil.timestampToTime(row.submitTime)}</span>
              )
            }
          },
        ]
      }></Table>
    </div>
  );
}
