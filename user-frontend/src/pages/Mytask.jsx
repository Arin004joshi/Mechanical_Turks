import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../utils";
import { useLocation } from "react-router-dom";

const Mytask = () => {
    const location = useLocation();
    const newTask = location.state?.newTask;   // the one you just created

    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem("token");
            const res = await fetch(`${BACKEND_URL}/api/user/task`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            console.log(data);
            if (res.ok) {
                setTasks(data.myTask.tasks);
            } else {
                console.error(data);
            }
        };
        fetchTasks();
    }, []);

    return (
        <div>
            <div>
                <h2>My Tasks</h2>
                <ul>
                    {tasks.map(task => (
                        <li key={task.id} style={{ color: task.done ? 'green' : 'red' }}>{task.id}-{task.title}-{task.amount}-{task.done ? "Done" : "Pending"}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Mytask
