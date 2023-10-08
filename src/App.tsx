import {
  FacebookOutlined,
  InstagramOutlined,
  LineOutlined,
  LoginOutlined,
  LogoutOutlined,
  MailOutlined,
  PhoneOutlined,
  TwitterOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import Icon from "@ant-design/icons/lib/components/Icon";
import {
  Carousel,
  Layout,
  Row,
  Col,
  Divider,
  Space,
  Button,
  List,
  Typography,
  Image,
  FloatButton,
  Menu,
  Avatar,
  Dropdown,
  Card,
  Input,
  Tag,
  Pagination,
  Tooltip,
  Form,
  message,
  Drawer,
  InputNumber,
  Rate,
  Spin,
  Modal,
  Alert,
} from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import axios from "axios";
import { useEffect, useState } from "react";

interface ResponseProduct {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface Auth {
  status: boolean;
  msg: string;
  data: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    gender: string;
    image: string;
    token: string;
    lastName: string;
  } | null;
}

const baseUrl = axios.create({
  baseURL: "https://dummyjson.com",
});

function App() {
  const [form] = Form.useForm();
  const [formDetail] = Form.useForm();

  const [data, setData] = useState<ResponseProduct>();
  // const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [productId, setProductId] = useState<number | null>(null);
  const [detail, setDetail] = useState<Product | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [keyword, setKeyWord] = useState<string>("");
  const [showModalLogin, setShowModalLogin] = useState<boolean>(false);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    pageSize: number;
  }>({
    page: 1,
    pageSize: 10,
  });

  useEffect(() => {
    setLoading(true);
    baseUrl
      .get("/products?skip=0&limit=10")
      .then((res) => {
        setData(res.data);
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      })
      .catch((e) => console.log("ERROR FETCH PRODUCTS", e));

    // baseUrl
    //   .get("/products/categories")
    //   .then((res) => setCategories(res.data))
    //   .catch((e) => console.log("ERROR FETCH PRODUCTS", e));
  }, []);

  useEffect(() => {
    setLoading(true);
    baseUrl
      .get(
        `/products?skip=${(pagination.page - 1) * pagination.pageSize}&limit=${
          pagination.pageSize
        }`
      )
      .then((res) => {
        setData(res.data);
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      })
      .catch((e) => console.log("ERROR FETCH PRODUCTS", e));
  }, [pagination]);

  useEffect(() => {
    baseUrl
      .get(
        `/products?q=${keyword}&skip=${
          (pagination.page - 1) * pagination.pageSize
        }&limit=${pagination.pageSize}`
      )
      .then((res) => {
        setData(res.data);
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      })
      .catch((e) => console.log("ERROR FETCH PRODUCTS", e));
  }, [keyword]);

  useEffect(() => {
    if (productId) {
      baseUrl
        .get(`products/${productId}`)
        .then((res) => setDetail(res.data))
        .catch((e) => console.log("ERROR FETCH DETAIL PRODUCT", e));
    }
    return () => {
      setDetail(null);
    };
  }, [productId]);

  useEffect(() => {
    if (detail) {
      formDetail.setFieldsValue({
        title: detail.title,
        description: detail.description,
        price: detail.price,
        discountPercentage: detail.discountPercentage,
        brand: detail.brand,
        category: detail.category,
      });
    }
  }, [detail]);

  function onFinish(values: any): void {
    console.log({ values });
    baseUrl
      .post("/auth/login", values, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setAuth({ status: true, msg: "Login success", data: res.data });
        form.resetFields();
        setShowModalLogin(false);
        message.success("Login success");
      })
      .catch((e) => {
        console.log(e);
        setAuth({
          status: false,
          msg: e.response.data.message || "",
          data: null,
        });
      });
  }

  useEffect(() => {}, [auth]);
  console.log({ auth });
  return (
    <>
      <Layout>
        <Header style={{ backgroundColor: "#FFFFFF" }}>
          <Row justify={"space-between"} align={"middle"}>
            <Col>
              <Menu
                mode="horizontal"
                items={[
                  {
                    key: 1,
                    label: "Home",
                  },
                  {
                    key: 2,
                    label: "Blogs",
                  },
                  {
                    key: 3,
                    label: "Contact Us",
                  },
                ]}
              />
            </Col>
            <Col>
              {auth?.status ? (
                <Dropdown
                  arrow={{ pointAtCenter: true }}
                  trigger={["click"]}
                  menu={{
                    items: [
                      {
                        key: 1,
                        label: (
                          <>
                            <table>
                              <tr>
                                <th role="row">Username</th>
                                <td>{auth.data?.username}</td>
                              </tr>
                              <tr>
                                <th role="row">Email</th>
                                <td>{auth.data?.email}</td>
                              </tr>
                              <tr>
                                <th role="row">Gender</th>
                                <td>{auth.data?.gender}</td>
                              </tr>
                            </table>
                          </>
                        ),
                      },
                      {
                        type: "divider",
                      },
                      {
                        key: 3,
                        label: (
                          <Button
                            danger
                            type="primary"
                            children={"Log out"}
                            block
                            icon={<LogoutOutlined />}
                            onClick={() => {
                              setAuth(null);
                              message.success("Log out success");
                            }}
                          />
                        ),
                        style: {
                          width: 250,
                        },
                      },
                    ],
                  }}
                >
                  <div>
                    <Avatar
                      src={
                        "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                      }
                    />
                    <span>
                      {[auth.data?.firstName, auth.data?.lastName].join(" ")}
                    </span>
                  </div>
                </Dropdown>
              ) : (
                <Button type="link" onClick={() => setShowModalLogin(true)}>
                  <LoginOutlined />
                  Login
                </Button>
              )}
            </Col>
          </Row>
        </Header>

        <Content style={{ minHeight: "100vh" }}>
          <Carousel autoplay>
            {[
              "https://storage-asset.msi.com/id/picture/banner/banner_1696235710e16f4ef4642e1828152fa3545ec22673.jpeg",
              "https://storage-asset.msi.com/id/picture/banner/banner_1695781925b2eea97ad2e687a413b8666c186fa220.jpeg",
              "https://storage-asset.msi.com/global/picture/banner/banner_1675824435ff54fd28878f270bcc1f4875c7c8efe1.jpeg",
              "https://storage-asset.msi.com/global/picture/banner/banner_1695193420848f74187b68662a6d68855961a064b2.jpeg",
              "https://storage-asset.msi.com/global/picture/banner/banner_16947658091f10bc8e7415c20df81ef326a84cd7fe.jpeg",
            ].map((imgUrl) => (
              <Image key={imgUrl} width={"100%"} src={imgUrl} preview={false} />
            ))}
          </Carousel>

          <br />
          <br />
          <Row justify={"center"}>
            <Col xs={20} md={16}>
              <Input
                onChange={({ target }) => setKeyWord(target.value)}
                size="large"
                style={{ width: "100%" }}
                allowClear
                placeholder="Search Products"
              />
            </Col>
          </Row>
          <Divider>
            <h2>LOOKING FOR THIS</h2>
          </Divider>

          <Row
            justify={"center"}
            style={{ flexDirection: "column" }}
            align={"middle"}
          >
            <Col xs={20}>
              <Spin spinning={loading} tip="Loading">
                <Row wrap gutter={[30, { xs: 20, lg: 25 }]}>
                  {data?.products.map((item) => (
                    <Col xs={24} md={12} lg={8} xl={6} key={item.id}>
                      <Card
                        // loading={loading}
                        style={{ minHeight: 400 }}
                        cover={
                          <Image.PreviewGroup items={item.images} preview>
                            <Image
                              src={item.thumbnail}
                              height={200}
                              fallback="data:image/png;base64,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"
                            />{" "}
                          </Image.PreviewGroup>
                        }
                      >
                        <Card.Meta
                          title={
                            <>
                              <Tooltip title={`Click to detail ${item.title}`}>
                                <Typography.Link
                                  onClick={() => {
                                    setProductId(item.id);
                                    setOpen(true);
                                  }}
                                  children={item.title}
                                />
                              </Tooltip>
                            </>
                          }
                          description={
                            <>
                              <Typography.Paragraph
                                children={item.description}
                              />

                              <br />
                              <Space direction="horizontal">
                                <Tag color="green">${item.price}</Tag>
                                <Rate disabled allowHalf value={item.rating} />
                              </Space>
                            </>
                          }
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Spin>
            </Col>
            <Col>
              <br />
              <br />
              <Pagination
                total={data?.total}
                current={pagination.page}
                showTotal={(total, range) =>
                  `${range[0]} - ${range[1]} from ${total} items`
                }
                onChange={(page, pageSize) => setPagination({ page, pageSize })}
              />

              <br />
              <br />
            </Col>
          </Row>
        </Content>

        <Footer
          style={{
            backgroundColor: "#141a1f",
            color: "white",
            minHeight: 403,
            paddingRight: 100,
            paddingLeft: 100,
          }}
        >
          <Row justify={"center"} align={"middle"} wrap>
            <Col xs={24} md={6} style={{ minHeight: 348, padding: 10 }}>
              <h2>
                About Us <br />
                <LineOutlined style={{ fontSize: 20, color: "grey" }} />
              </h2>

              <p style={{ width: "90%" }}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo
                quas cumque eius tempora maxime totam recusandae excepturi quos
                labore amet, voluptatum doloribus accusantium et voluptatem
                dignissimos possimus molestias atque veniam?
              </p>
              <br />
              <Space size={2} wrap>
                {[
                  YoutubeOutlined,
                  FacebookOutlined,
                  InstagramOutlined,
                  TwitterOutlined,
                  MailOutlined,
                  PhoneOutlined,
                ].map((item, index) => (
                  <Button
                    key={index}
                    ghost
                    shape="circle"
                    icon={
                      <Icon
                        component={item as React.ForwardRefExoticComponent<any>}
                      />
                    }
                  />
                ))}
              </Space>
            </Col>
            <Col xs={24} md={6} style={{ minHeight: 348, padding: 10 }}>
              <h2>
                Information <br />
                <LineOutlined style={{ fontSize: 20, color: "grey" }} />
              </h2>

              <List
                split={false}
                dataSource={[
                  "Home",
                  "Privacy Policy",
                  "Frequently Asked Questions (FAQ)",
                  "Store Location",
                  "Term & Conditions",
                ]}
                renderItem={(item) => (
                  <Typography.Paragraph style={{ color: "white" }} key={item}>
                    {" "}
                    <a style={{ color: "white" }}>{item}</a>
                  </Typography.Paragraph>
                )}
              />
            </Col>
            <Col xs={24} md={6} style={{ minHeight: 348, padding: 10 }}>
              <h2>
                Order <br />
                <LineOutlined style={{ fontSize: 20, color: "grey" }} />
              </h2>

              <List
                split={false}
                dataSource={[
                  "How To Order",
                  "Shippings",
                  "Returns",
                  "Size Chart",
                ]}
                renderItem={(item) => (
                  <Typography.Paragraph style={{ color: "white" }} key={item}>
                    <a style={{ color: "white" }}>{item}</a>
                  </Typography.Paragraph>
                )}
              />
            </Col>
            <Col xs={24} md={6} style={{ minHeight: 348, padding: 10 }}>
              <h2>
                Contact Us <br />
                <LineOutlined style={{ fontSize: 20, color: "grey" }} />
              </h2>

              <div>
                <h5>ONLINE SERVICE</h5>
                <p>
                  Monday-Sunday <br />
                  <span>08.00 - 17.00 [Exc Public Holiday]</span>
                </p>
              </div>
              <div>
                <h5>CUSTOMER SERVICE</h5>
                <p>
                  Email :
                  <a href="mailto:halo@world.com" style={{ color: "white" }}>
                    halo@world.com
                  </a>
                  <br />
                  <span>
                    Whatsapp :{" "}
                    <a href="tel:+938928292929" style={{ color: "white" }}>
                      938928292929
                    </a>
                  </span>
                  <br />
                  <span>LINE : @LoremIpsumProducts</span>
                </p>
              </div>
            </Col>
          </Row>
          <br />
          <br />
          <span>&copy; 2023 Copyright | Official Website | PT IT JAYA</span>
        </Footer>
      </Layout>

      {/* Drawer detail */}
      <Drawer
        title={detail?.title}
        onClose={() => {
          setOpen(false);
        }}
        open={open}
        extra={<Tag color="green-inverse">{detail?.stock} items</Tag>}
      >
        <Form
          form={formDetail}
          labelWrap
          labelCol={{ flex: 150 }}
          disabled
          layout="vertical"
        >
          <Form.Item label="Title" name={"title"}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name={"description"}>
            <Input.TextArea autoSize={{ minRows: 6 }} />
          </Form.Item>
          <Row justify={"space-between"}>
            <Col span={11}>
              <Form.Item label="Brand" name={"brand"}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item label="Category" name={"category"}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row justify={"space-between"}>
            <Col span={11}>
              <Form.Item label="Price" name={"price"}>
                <InputNumber />
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item label="Discount" name={"discountPercentage"}>
                <InputNumber />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Image src={detail?.thumbnail} preview={false} />
          </Form.Item>
        </Form>
      </Drawer>

      {/* Modal login */}
      <Modal
        open={showModalLogin}
        footer={false}
        onCancel={() => {
          setShowModalLogin(false);
          form.resetFields(), setAuth(null);
        }}
      >
        {auth ? (
          auth.status ? (
            <Alert message={auth.msg} type="success" style={{ width: "95%" }} />
          ) : (
            <Alert message={auth.msg} type="error" style={{ width: "95%" }} />
          )
        ) : null}

        <p>user for login username: 'kminchelle', password: '0lelplR',</p>
        <Form
          name="formLogin"
          layout="vertical"
          form={form}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input allowClear />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password allowClear />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <FloatButton.BackTop visibilityHeight={500} />
    </>
  );
}

export default App;
