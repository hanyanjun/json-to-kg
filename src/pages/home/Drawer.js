import React, { useEffect, useState } from 'react';
import { Drawer , Tag} from 'antd';


const Drawers = (props) => {
    const [visible, setVisible] = useState(props.visible);
    let {info} = props;

    useEffect(()=>{
        setVisible(props.visible)
    },[props.visible])
  
    const onClose = () => {
      setVisible(false);
      props.onClose && props.onClose()
    };

    return(
        <>
          <Drawer
            title={<Tag color="green">{info.id}</Tag>}
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visible}
          >
              {
                  (info.properties || []).map(item => (
                    item.key !== 'project' && <p key={item.key}><Tag color="blue">{item.key}</Tag> : {item.value || '--'}</p>
                ))
              }
          </Drawer>
        </>
    )
}

export default Drawers;