import React, {useState} from 'react'
import {Modal, Button, Checkbox} from '@shopify/polaris';

function ColSelector({headerFlags, currentCols, setCols}) {
  const [active, setActive] = useState(false);
  const [tempCols, setTempCols] = useState(currentCols);

  const activator = <Button onClick={() => setActive(true)}>Select Columns</Button>

  const checkChange = (key) => {
    const currentlyChecked = (tempCols & headerFlags[key]) !== 0;
    setTempCols(currentlyChecked ? tempCols &~ headerFlags[key] : tempCols | headerFlags[key]);
  }

  return (
    <div>
      <Modal 
        activator={activator} 
        open={active} 
        onClose={() => setActive(false)} 
        title={"Select Columns"} 
        primaryAction={{content: 'Submit', onAction: () => {setCols(tempCols); setActive(false);}}}>
        <Modal.Section>
          {Object.keys(headerFlags).map(key => {
            return <div key={key} ><Checkbox label={key} value={headerFlags[key]} checked={(tempCols & headerFlags[key]) !== 0} onChange={() => checkChange(key)} /></div>
          })}
        </Modal.Section>
      </Modal>
    </div>
  )
}

export default ColSelector
