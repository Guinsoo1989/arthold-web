import ProductList from "@/components/ProductList";
import axios from "axios";
import React, { useState } from "react";
import styles from "./products.less";
import { Product } from "mock/products";
import { useMount } from "ahooks";
import { Button, Input, Space } from "antd";
import { request } from "umi";
import { MjApi } from "@/api/mjApi";

const form = {
  text: "",
};

const id = "6284560417306491";

const jpg =
  "https://cdn.discordapp.com/attachments/1118933179361935526/1126021591222980608/guinsoo1998_dragon_dog_1272e7d1-4b19-4f72-8688-f876eaeae4e9.png";

export default function Page() {
  const [productList, setProductList] = useState<Product[]>([]);


  useMount(async () => {
    axios.get<{ data: Product[] }>("/api/products").then((res) => {
      const list = res.data.data;
      setProductList(list);
    });

    const data = await MjApi.getTaskById("6284560417306491");
    console.log(777, data);
  });

  if (!productList.length) return null;

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
      <ProductList
        products={productList}
        onDelete={(id) => {
          console.log("delete");
        }}
      />
    </div>
  );
}
