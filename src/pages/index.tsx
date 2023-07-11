import ProductList from "@/components/ProductList";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./products.less";
import { useLocalStorageState, useMount } from "ahooks";
import { Button, Image, Input, Modal, Space, Table, Tag, message, notification } from "antd";
import { ImageIndex, MjApi, SubmitChange, SubmitCode, SubmitRes } from "@/api/mjApi";
import { Task, TaskItem } from "@/type";
import { TimeUtil } from "@/util/TimeUtil";
import { request } from "umi";
import { DbUtil, db } from "@/service/db";
import { ObjUtil } from "@/util/ObjUtil";
import { InitTasks } from "@/test";

const form = {
  prompt: "",
};


export default function Page() {

  const [taskList, setTaskList] = useLocalStorageState<Task[]>('mj-task-list', {
    defaultValue: [],
  });

  const [rows, setRows] = useState<TaskItem[]>([])

  const [showDetail, setShowDetail] = useState(false)
  const [curTaskId, setCurTaskId] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    if (!taskList?.length) {
      return
    }

    // 从数据库加载图片
    const asyncLoadDb = async () => {
      const list = []
      for (const task of taskList) {
        const item = { ...task } as TaskItem;
        list.push(item);

        const mjImage = await DbUtil.mjImage.findById(task.id)
        if (mjImage) {
          item.imageBlob = mjImage.image;
        } else {
          if (task.status === 'SUCCESS' && task.imageUrl) {
            console.log("下载图片：", task.imageUrl)
            const image = await DbUtil.mjImage.add(task.id, task.imageUrl)
            item.imageBlob = image
          }
        }
      }
      return list;
    };

    asyncLoadDb().then(list => setRows(list))

  }, [taskList])


  useMount(async () => {
    // const newList = []
    // for (const per of taskList!) {
    //   if (per.id) {
    //     newList.push(per)
    //   }
    // }
    // setTaskList(newList)
  });


  /********************* network ***************************/
  async function imagine() {
    submitTask(async () => {
      return await MjApi.submit.imagine(form)
    })
  }

  async function upscale(taskId: string, index: ImageIndex) {
    submitTask(async () => {
      return await MjApi.submit.change({
        action: 'UPSCALE',
        taskId,
        index
      })
    })
  }

  async function variation(taskId: string, index: ImageIndex) {
    submitTask(async () => {
      return await MjApi.submit.change({
        action: 'VARIATION',
        taskId,
        index
      })
    })
  }

  async function zoom(taskId: string) {
    submitTask(async () => {
      return await MjApi.submit.change({
        action: 'ZOOM',
        taskId,
        index: 1
      })
    })
  }

  /********************* ui ***************************/
  async function submitTask(submitFn: () => Promise<SubmitRes>) {
    notification.info({
      message: "任务提交中..."
    })
    setLoading(true)
    const { code, result: taskId, description } = await submitFn()
    if (code !== SubmitCode.提交成功) {
      setLoading(false)
      notification.error({
        message: description
      })
      return;
    }
    const task = await MjApi.getTaskById(taskId)
    setLoading(false)
    if (!task) {
      notification.error({
        message: "获取任务失败"
      })
      return;
    }
    notification.success({
      message: "任务执行中..."
    })
    setTaskList([task, ...taskList!])
  }

  function opBtns(task: Task) {
    const { id, action } = task;
    if (action === 'UPSCALE') {
      return (
        <Button onClick={() => {
          zoom(id)
        }}>Zoom 1.5x</Button>
      )
    }
    return (
      <>
        <Space.Compact direction="vertical">
          {upscaleBtns(id)}
        </Space.Compact>

        <Space.Compact direction="vertical">
          {variationBtns(id)}
        </Space.Compact>
      </>
    )
  }

  function upscaleBtns(id: string) {
    const btns = []
    for (let i = 1; i <= 4; i++) {
      btns.push(
        <Button key={i} onClick={() => {
          upscale(id, i as ImageIndex)
        }}>放大{i}</Button>
      )

    }
    return btns
  }

  function variationBtns(id: string) {
    const btns = []
    for (let i = 1; i <= 4; i++) {
      btns.push(
        <Button key={i} onClick={() => {
          variation(id, i as ImageIndex)
        }}>变换{i}</Button>
      )

    }
    return btns
  }

  return (
    <div>
      <Space.Compact style={{ width: "100%" }}>
        <Input
          placeholder="请输入英文提示语"
          onChange={(e) => {
            form.prompt = e.currentTarget.value;
          }}
        />
        <Button
          type="primary"
          onClick={imagine}
        >
          开始作图
        </Button>
        {/* <Button
          type="primary"
          onClick={async () => {
            const tasks = await MjApi.getTaskByIds({ ids: InitTasks })
            setTaskList(tasks)
          }}
        >
          初始化
        </Button> */}
      </Space.Compact>

      <Table rowKey="id" loading={loading} bordered dataSource={rows} columns={
        [
          {
            title: "图片",
            render: (_, row) => {
              const { status, imageUrl } = row
              if (status === 'IN_PROGRESS' && imageUrl) {
                return (
                  <Image
                    width={200}
                    src={imageUrl}
                  />
                )
              }

              const localImageUrl = row.imageBlob ? window.URL.createObjectURL(row.imageBlob) : null;

              return (
                <div>
                  {
                    localImageUrl ?
                      (
                        <Image
                          width={200}
                          src={localImageUrl}
                        />
                      )
                      : null
                  }

                </div>
              )
            }
          },
          {
            title: "任务id",
            render(_, row) {
              return (
                <Tag onClick={() => {
                  // setShowDetail(true)
                }}>
                  <a>{row.id}</a>
                </Tag>
              )
            }
          },
          {
            title: "提示词",
            dataIndex: "prompt"
          },
          {
            title: "描述",
            dataIndex: "description"
          },
          {
            title: "提交时间",
            render(_, row) {
              return (
                <span>{TimeUtil.timestampToTime(row.submitTime)}</span>
              )
            }
          },
          {
            title: "进度",
            dataIndex: "progress"
          },
          {
            title: "状态",
            dataIndex: "status"
          },
          {
            title: "操作",
            render(_, row) {
              const { id } = row
              return (
                <Space size={'small'}>
                  <Button onClick={async () => {
                    setLoading(true)
                    const task = await MjApi.getTaskById(row.id)
                    console.log('刷新任务：', task)
                    for (const per of taskList!) {
                      if (per.id === task.id) {
                        ObjUtil.copyProperties(task, per)
                      }
                    }
                    setTaskList([...taskList!])
                    setLoading(false)
                  }}>刷新</Button>

                  {opBtns(row)}
                </Space>
              )
            }
          },
        ]
      }></Table>

      <Modal title="Basic Modal" open={showDetail} onOk={() => { }} onCancel={() => { setShowDetail(false) }}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </div>
  );

}