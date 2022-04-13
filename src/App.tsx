import React from 'react';
import DynamicTable from './components/dynamicTable/DynamicTable'

function App() {
  const data = [
    { name: "jenny", value1: "1", value2: "2" },
    { name: "tom", value1: "1", value2: "2" },
    { name: "jerry", value1: "1", value2: "2" }
  ]

  return (
    <>
      {/* <div className="title">The Design Process</div> */}
      <DynamicTable data={data} />
    </>
  );
}
export default App;
