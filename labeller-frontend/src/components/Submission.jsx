import React from 'react'
import { useState } from 'react'
import { BACKEND_URL } from '../utils';
import NextTask from './NextTask';

const Submission = () => {
  const [taskId, setTaskid] = useState("");
  const [optionId, setOptionid] = useState("");
  const [processing, setProcessing] = useState();
  const [txSignature, setTxSignature] = useState("");
  const [payout, setPayout] = useState("");

  const handleTaskSubmit = async () => {

    if (!taskId || !optionId) {
      alert("TaskId or OptionId missing");
    }

    const payload = {
      taskId,
      optionId: Number(optionId)
    }

    try {
      setProcessing(true)
      const token = localStorage.getItem("token")
      const res = await fetch(`${BACKEND_URL}/api/labeller/submission`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        signature: txSignature,
        body: JSON.stringify(payload)
      })
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        alert("Task submitted successfully!");
        setTaskid("");
        setOptionid("");
      } else {
        alert(`Failed: ${data.message || JSON.stringify(data)}`);
      }
      setProcessing(false);
    } catch (error) {
      console.log(error);
      alert("Error submitting task. Check console.");
    }
  }

  const getPayout = async (params) => {
    const amountToPayout = 12000;
    try {
      setPayout(true)
      const token = localStorage.getItem("token")
      const res = await fetch(`${BACKEND_URL}/api/labeller/payout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amountToPayout })
      })
      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setPayout(data)
      }

    } catch (error) {
      console.log("your payout had some internal errors");
    }
  }

  const makePayments = async (params) => { }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Submit Task</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Task ID:</label>
        <input
          type="text"
          value={taskId}
          onChange={(e) => setTaskid(e.target.value)}
          placeholder="Enter Task ID"
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Option ID:</label>
        <input
          type="number"
          value={optionId}
          onChange={(e) => setOptionid(e.target.value)}
          placeholder="Enter Option ID"
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <button
        onClick={handleTaskSubmit}
        disabled={processing}
        className={`w-full py-2 rounded text-white ${processing ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
      >
        {processing ? "Processing..." : "Submit Task"}
      </button>

      <button
        onClick={getPayout}
        disabled={processing}
        className={`w-full py-2 rounded text-white ${processing ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
      >
        {processing ? "Processing..." : "Get Payout"}
      </button>
    </div>
  );
}

export default Submission
