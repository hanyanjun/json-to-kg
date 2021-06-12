
import React from "react";
import { TimePicker , Row , Col , Select , Button } from 'antd';

const { Option } = Select;



export default function(){


    const onChangeSelect = (value)=>{
        console.log(value)

    }
    return(
        <Row style={{padding : '20px'}}>
            <Col span="2">
                <Button>加载json</Button>
            </Col>
            <Col span={6} offset="1">
                <TimePicker.RangePicker />
            </Col>
            <Col span={6} offset="1">
            <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="选择"
                // defaultValue={}
                onChange={onChangeSelect}
                optionLabelProp="label"
            >
                <Option value="china" label="China">
                <div className="demo-option-label-item">
                    <span role="img" aria-label="China">
                    🇨🇳
                    </span>
                    China (中国)
                </div>
                </Option>
                <Option value="usa" label="USA">
                <div className="demo-option-label-item">
                    <span role="img" aria-label="USA">
                    🇺🇸
                    </span>
                    USA (美国)
                </div>
                </Option>
                <Option value="japan" label="Japan">
                <div className="demo-option-label-item">
                    <span role="img" aria-label="Japan">
                    🇯🇵
                    </span>
                    Japan (日本)
                </div>
                </Option>
                <Option value="korea" label="Korea">
                <div className="demo-option-label-item">
                    <span role="img" aria-label="Korea">
                    🇰🇷
                    </span>
                    Korea (韩国)
                </div>
                </Option>
            </Select>
            </Col>
            <Col span="4" offset="1">
                <Button type="primary">查询</Button>
            </Col>
        </Row>
    )
}