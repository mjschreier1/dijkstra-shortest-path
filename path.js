// Assume that input maze will always be a square
function shortestPath(maze, origin, destination) {
    const encode = point => point.y * maze[0].length + point.x + 1;
    const decode = n => n % maze[0].length === 0 
        ? { x: 9, y: Math.floor(n / maze[0].length) - 1 } 
        : { x: n % maze[0].length - 1, y: Math.floor(n / maze[0].length) };

    const getLeftCoord = n => ({ x: n.x - 1, y: n.y });
    const getRightCoord = n => ({ x: n.x + 1, y: n.y });
    const getUpCoord = n => ({ x: n.x, y: n.y - 1 });
    const getDownCoord = n => ({ x: n.x, y: n.y + 1 });

    const writePath = p => {
        const coord = decode(p.encoded);
        maze[coord.y][coord.x] = 2;
        if (coord.x === origin.x && coord.y === origin.y) {
            console.log(`Shortest path found in ${points[encode(destination)].cost} steps - path outlined with 2s`);
            console.log(maze);
        } else {
            writePath(points[p.via]);
        }
    }
    
    class Queue {
        constructor() {
            this.data = [];
        }

        enqueue(point) {
            this.data.push(point);
        }

        dequeue() {
            return this.data.shift();
        }

        length() {
            return this.data.length;
        }
    }

    // Points is a hashmap that holds data regarding visited points in the maze
    let points = {};
    // Q is a queue of points to evaluate paths from - since every path accrues a cost of 1, a priority queue is not necessary
    let q = new Queue();

    // Kick off the execution with our first data point!
    points[encode(origin)] = { cost: 0, via: null, encoded: encode(origin) };
    q.enqueue(points[encode(origin)]);

    while (!points[encode(destination)]) {
        const p = q.dequeue();
        const pCoord = decode(p.encoded);
        const leftCoord = getLeftCoord(pCoord);
        const rightCoord = getRightCoord(pCoord);
        const upCoord = getUpCoord(pCoord);
        const downCoord = getDownCoord(pCoord);

        let unvisitedQ = new Queue();
        // Check the four adjacent points (x + 1, x - 1, y + 1, y - 1)
        // Ignore points that fall outside the maze (i.e. if x = 0, don't check x - 1)
        // Ignore any adjacent points with a value of 0
        // Ignore any adjacent point that has been visited already (which includes the "via" point)
        if (pCoord.x > 0 
            && maze[leftCoord.y][leftCoord.x] 
            && !points[encode(leftCoord)]) 
                unvisitedQ.enqueue(leftCoord);
        if (pCoord.x < maze[0].length - 1 
            && maze[rightCoord.y][rightCoord.x] 
            && !points[encode(rightCoord)]) 
                unvisitedQ.enqueue(rightCoord);
        if (pCoord.y > 0
            && maze[upCoord.y][upCoord.x]
            && !points[encode(upCoord)])
                unvisitedQ.enqueue(upCoord);
        if (pCoord.y < maze.length - 1
            && maze[downCoord.y][downCoord.x]
            && !points[encode(downCoord)])
                unvisitedQ.enqueue(downCoord)
        
        // Create a point in the points hashmap for each adjacent point that matched the above criteria
        // Place those points in the q
        while (unvisitedQ.length() > 0) {
            const point = unvisitedQ.dequeue();
            const encodedPoint = encode(point);
            points[encodedPoint] = { cost: p.cost + 1, via: p.encoded, encoded: encodedPoint };
            q.enqueue(points[encodedPoint]);
        }

        // If the q is empty, return an error that there is no path through the maze
        if (q.length() === 0) {
            console.log("No paths exist!");
            return;
        }
    }

    // Display the shortest path through the maze using the number 2
    writePath(points[encode(destination)]);
}

const maze = 
[
    [1, 1, 0, 1, 0, 0, 0, 1, 1, 1],
    [0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 1, 0, 1, 1, 1, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 1, 1, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 0, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 0, 1, 0, 0],
    [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1]
];

shortestPath(maze, { x: 0, y: 0 }, { x: 9, y: 9 });