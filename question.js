
/*
    The goal of this exercise is to take a polygon defined by the points 'points', use the mouse
    events to draw a line that will split the polygon and then draw the two split polygons.
    In the start, you'll have the initial polygon (start.png)
    While dragging the mouse, the polygon should be shown along with the line you're drawing (mouseMove.png)
    After letting go of the mouse, the polygon will be split into two along that line (mouseUp.png)

    The code provided here can be used as a starting point using plain-old-Javascript, but it's fine
    to provide a solution using react/angular/vue/etc if you prefer.
*/

var lineStart, lineEnd, dividerPath = null;

function onMouseDown(e) {
    //Add code here
    var svg = document.getElementsByTagName("svg")[0];
    var pt = svg.createSVGPoint();
    pt.x = e.clientX; 
    pt.y = e.clientY;
    lineStart = pt.matrixTransform(svg.getScreenCTM().inverse());
}

function onMouseMove(e) {
    //Add code here
    var svg = document.getElementsByTagName("svg")[0];
    var pt = svg.createSVGPoint();
    pt.x = e.clientX; 
    pt.y = e.clientY;
    lineEnd = pt.matrixTransform(svg.getScreenCTM().inverse());
}

function onMouseUp(e) {
    let divider = drawDividerLine([lineStart, lineEnd]);
    const poly1 = [];
    const poly2 = [];

    let pathLines = [];
    points.forEach((pt, i) => {
        if(points[i+1]) {
            pathLines.push({ x1: pt.x, y1: pt.y, x2: points[i+1].x, y2: points[i+1].y });
        } else {
            pathLines.push({ x1: pt.x, y1: pt.y, x2: points[0].x, y2: points[0].y });
        }
    });

    let interception;
    pathLines.forEach(line => {
        console.log(findIntersections(line, divider));
        interception = findIntersections(line, divider);
        if(interception.onLine1 || interception.onLine2) {
            poly1.push({ x: interception.x, y: interception.y });
            poly2.push({ x: interception.x, y: interception.y });
        }
    });

    //Generate the two sets of points for the split polygons
    //An algorithm for finding interceptions of two lines can be found in https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection

    // clearPoly();
    addPoly(poly1, 'blue');
    addPoly(poly2, 'green');
}

function drawDividerLine(points) {
    var svg = document.getElementsByTagName("svg")[0];
    if(dividerPath) {
        svg.removeChild(document.getElementById('divider-line'));
        dividerPath = null;
    }
    var dividerPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');

    let path = 'M' + points[0].x + ' ' + points[0].y
    
    for(const point of points) {
        path += ' L' + point.x + ' ' + point.y;
    }
    path += " Z";
    dividerPath.setAttribute('d', path);
    dividerPath.setAttribute('stroke', '#003377');

    svg.appendChild(dividerPath);
    return { x1: points[0].x, y1: points[0].y, x2: points[1].x, y2: points[1].y };
}

/*
    returns the intersection point for two lines
    @params: line1 : { x1, y1, x2, y2 }
    @params: line2 : { x1, y1, x2, y2 }
    Reference: http://jsfiddle.net/justin_c_rounds/Gd2S2/light/
*/
function findIntersections(line1, line2) {
    var result = { x: null, y: null, onLine1: false, onLine2: false };
    var computedDenominator = (line2.y2 - line2.y1) * (line1.x2 - line1.x1) - (line2.x2 - line2.x1) * (line1.y2 - line1.y1);
    if(computedDenominator === 0) {
        return { x: null, y: null, onLine1: false, onLine2: false }
    }
    var a, b;
    
    a = line1.y1 - line2.y1;
    b = line1.x1 - line2.x1;

    var numerator1 = ((line2.x2 - line2.x1) * a) - ((line2.y2 - line2.y1) * b);
    var numerator2 = ((line1.x2 - line1.x1) * a) - ((line1.y2 - line1.y1) * b);

    a = numerator1 / computedDenominator;
    b = numerator2 / computedDenominator;

    result.x = line1.x1 + (a * (line1.x2 - line1.x1));
    result.y = line1.y1 + (a * (line1.y2 - line1.y1));

    if(a > 0 && a < 1) {
        result.onLine1 = true;
    }

    if(b > 0 && b < 1) {
        result.onLine1 = true;
    }

    return result;
}

/*
	Code below this line shouldn't need to be changed
*/

//Draws a polygon from the given points and sets a stroke with the specified color
function addPoly(points, color = 'black') {
    
    const content = document.getElementById('content');
    
    var svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    var svgPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    
    if(points.length < 2) {
        console.error("Not enough points");
        return;
    }
    
    let path = 'M' + points[0].x + ' ' + points[0].y
    
    for(const point of points) {
        path += ' L' + point.x + ' ' + point.y;
    }
    path += " Z";
    svgPath.setAttribute('d', path);
    svgPath.setAttribute('stroke', color);
    
    svgElement.setAttribute('height', "500"); 
    svgElement.setAttribute('width', "500");
    svgElement.setAttribute('style', 'position: absolute;');
    svgElement.setAttribute('fill', 'transparent');
    
    svgElement.appendChild(svgPath);
    content.appendChild(svgElement);
}

//Clears the all the drawn polygons
function clearPoly() {
    const content = document.getElementById('content');
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }
}

//Sets the mouse events needed for the exercise
function setup() {
    this.clearPoly();
    this.addPoly(points);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
}

const points = [
    { x : 100, y: 100 },
    { x : 200, y: 50 },
    { x : 300, y: 50 },
    { x : 400, y: 200 },
    { x : 350, y: 250 },
    { x : 200, y: 300 },
    { x : 150, y: 300 },
]

window.onload = () => setup()




























