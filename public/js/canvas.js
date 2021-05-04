window.onload = () => {
    const canvas = document.getElementById("canvas");
    const colorSelect = document.getElementById("drawing-color");
    const isBrushSelected = document.getElementById("brush-radio");
    const toolSize = document.getElementById("tool-size");
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.lineJoin = "round";
    const bgColor = "#f0f0f0";

    // Drawing state
    let drawing = false;
    let latestPoint;

    // Drawing function
    const continueStroke = newPoint => {
        context.translate(0.5, 0.5);
        const scaleX = canvas.width / canvas.offsetWidth;
        const scaleY = canvas.height / canvas.offsetHeight;
        context.beginPath();
        const startPoint = latestPoint;
        context.moveTo(scaleX * latestPoint[0], scaleY * latestPoint[1]);
        context.strokeStyle = isBrushSelected.checked ? colorSelect.value : bgColor;
        context.lineWidth = toolSize.value * 3;

        if (!isBrushSelected.checked) {
            context.lineWidth *= 2;
        }

        context.lineTo(scaleX * newPoint[0], scaleY * newPoint[1]);
        context.stroke();
        latestPoint = newPoint;
        context.translate(-0.5, -0.5);

        socket.emit("canvas-update", {
            pointStart: startPoint,
            pointEnd: newPoint,
            lineWidth: context.lineWidth,
            color: context.strokeStyle
        });
    };

    // Event helpers
    const startStroke = point => {
        drawing = true;
        latestPoint = point;
        continueStroke(point)
    };

    const endStroke = evt => {
        if (!drawing) {
            return;
        }
        drawing = false;
        evt.currentTarget.removeEventListener("mousemove", onMouseMove, false);
    };

    const BUTTON = 0b01;
    const isMouseButtonDown = buttons => (BUTTON & buttons) === BUTTON;

    // Event handlers
    const onMouseMove = evt => {
        if (!drawing) {
            return;
        }
        continueStroke([evt.offsetX, evt.offsetY]);
    };

    const onMouseDown = evt => {
        if (drawing) {
            return;
        }
        evt.preventDefault();
        canvas.addEventListener("mousemove", onMouseMove, false);
        startStroke([evt.offsetX, evt.offsetY]);
    };

    const onMouseEnter = evt => {
        if (!isMouseButtonDown(evt.buttons) || drawing) {
            return;
        }
        onMouseDown(evt);
    };

    // Register event handlers
    canvas.addEventListener("mousedown", onMouseDown, false);
    canvas.addEventListener("mouseup", endStroke, false);
    canvas.addEventListener("mouseout", endStroke, false);
    canvas.addEventListener("mouseenter", onMouseEnter, false);

    const drawLine = (pointStart, pointEnd, lineWidth, color) => {
        console.log("received");
        context.translate(0.5, 0.5);
        const scaleX = canvas.width / canvas.offsetWidth;
        const scaleY = canvas.height / canvas.offsetHeight;
        context.beginPath();
        context.moveTo(scaleX * pointStart[0], scaleY * pointStart[1]);
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        context.lineTo(scaleX * pointEnd[0], scaleY * pointEnd[1]);
        context.stroke();
        context.translate(-0.5, -0.5);
    };

    socket.on("canvas-update", data => drawLine(data.pointStart, data.pointEnd, data.lineWidth, data.color));
};