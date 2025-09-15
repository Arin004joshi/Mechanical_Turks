import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { BACKEND_URL } from '../utils';

const NextTask = () => {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    const getNextTasks = async () => {
      const token = localStorage.getItem("token")
      const res = await fetch(`${BACKEND_URL}/api/labeller/nextTask`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        setTasks(data.task);
      } else {
        console.error(data);
      }
    }
    getNextTasks();
  }, [])
  return (
    <div>
      <h2>Task for you to label :</h2>

      {tasks ? (
        <div>
          <h3>{tasks.title}</h3>
          <ul>
            {tasks?.options?.map((opt) => (
              <li key={opt.id}>
                <img src={opt.image_url} alt="image" width={200} />
                <p>Task ID: {opt.task_id}</p>
                <p>Option ID: {opt.id}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading task…</p>
      )}
    </div>
  )
}

export default NextTask
