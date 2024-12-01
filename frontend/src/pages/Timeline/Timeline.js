import React, { useState, useEffect, useRef } from "react";
import Gantt from "frappe-gantt";
import "./Timeline.css";

const Timeline = () => 
{
    const ganttRef = useRef(null);
    const [tasks, setTasks] = useState([
    {
        id: "Task 1",
        name: "Working on this project (literally hahaha)",
        start: "2024-11-30",
        end: "2024-12-05",
        progress: 30,
    },
    {
        id: "Task 2",
        name: "Develop Backend",
        start: "2024-12-06",
        end: "2024-12-12",
        progress: 50,
    },
    {
        id: "Task 3",
        name: "Testing",
        start: "2024-12-13",
        end: "2024-12-15",
        progress: 10,
    },
    ]);

    // Variable to track if the Gantt has been initialized
    const initialized = useRef(false);

    // Initializing the Gantt chart
    useEffect(() => {
        if (ganttRef.current && !initialized.current)
        {
            initialized.current = true; // Mark the Gantt chart as initialized
            new Gantt(ganttRef.current, tasks, 
            {
                on_click: (task) => console.log(`Task clicked: ${task.name}`),
                on_date_change: (task, start, end) => 
                {
                    console.log(`Task updated:`, task, start, end);
                    updateTaskDates(task, start, end);
                },
                on_progress_change: (task, progress) => 
                {
                    console.log(`Task progress updated:`, task, progress);
                },
                on_view_change: (mode) => console.log(`View changed: ${mode}`),
            });
        }
    }, [tasks]);

    // Update task dates when dragged/resized
    const updateTaskDates = (task, start, end) => 
    {
        setTasks((prevTasks) =>
            prevTasks.map((t) =>
                t.id === task.id ? { ...t, start, end } : t
            )
        );
    };

    return (
        <div>
            <h1>Timeline</h1>
            <div ref={ganttRef} />
        </div>
    );
};

export default Timeline;