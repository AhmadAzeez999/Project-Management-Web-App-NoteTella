import React, { useRef, useEffect, useCallback } from 'react';
import { useSocket } from '../../../contexts/SocketProvider';

const Brush = ({ mode, drawing, setDrawing }) => 
{
    const canvasRef = useRef(null);
    const isDrawing = useRef(false); // Keeps track of whether the user is currently drawing

    const socket = useSocket();

    // Function to handle the brush drawing logic
    const handleMouseDown = (e) =>
    {
        if (mode !== 'brush') 
            return; // Only allow drawing if in brush mode

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { offsetX, offsetY } = e.nativeEvent;
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        isDrawing.current = true;

        // Emitting the starting point
        socket.emit("drawing-data", { type: "begin", x: offsetX, y: offsetY });
    };

    const handleMouseMove = (e) =>
    {
        if (mode !== 'brush' || !isDrawing.current) 
            return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { offsetX, offsetY } = e.nativeEvent;
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();

        // Emit the drawing coordinates
        socket.emit("drawing-data", { type: "draw", x: offsetX, y: offsetY });
    };

    const handleMouseUp = () => 
    {
        if (mode !== 'brush')
            return;
        isDrawing.current = false;
        saveDrawing();
    };

    const handleMouseOut = () =>
    {
        if (mode !== 'brush')
            return;
        isDrawing.current = false;
    };

    // Saving the current drawing as a base64 string
    const saveDrawing = () =>
    {
        const canvas = canvasRef.current;
        const dataURL = canvas.toDataURL(); // Getting the base64 representation of the canvas
        setDrawing(dataURL); // Storing the dataURL in the parent state
        console.log("Saving drawing: ", dataURL);
    };

    // Loading the previous drawing from the base64 string
    const loadDrawing = useCallback(() =>
    {
        console.log("Drawing? ", drawing);
        if (drawing) 
        {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.src = drawing;
            img.onload = () => 
            {
                ctx.drawImage(img, 0, 0);
            };
        }
    }, [drawing]);

    useEffect(() =>
    {
        loadDrawing(); // Loading the drawing when the component mounts or when drawing changes
    }, [drawing, loadDrawing]);

    // Listen for real-time drawing updates from the server
    useEffect(() => 
    {
        socket.on("drawing-data", (data) =>
        {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            if (data.type === "begin")
            {
                ctx.beginPath();
                ctx.moveTo(data.x, data.y);
            } 
            else if (data.type === "draw")
            {
                ctx.lineTo(data.x, data.y);
                ctx.stroke();
            }
        });

        // Listen for a saved drawing being sent
        socket.on("load-drawing", (dataURL) =>
        {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.src = dataURL;
            img.onload = () =>
            {
                ctx.drawImage(img, 0, 0);
            };
        });

        return () =>
        {
            socket.off("drawing-data");
            socket.off("load-drawing");
        };
    }, [socket]);

    return (
        <canvas
            ref={canvasRef}
            width="1800"
            height="1000"
            className="whiteboard-canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseOut={handleMouseOut}
        />
    );
};

export default Brush;
