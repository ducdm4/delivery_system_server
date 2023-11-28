export class Graph {
  neighbors = {};
  constructor() {
    this.neighbors = {};
  }

  addEdge(u, v) {
    if (!this.neighbors[u]) this.neighbors[u] = [];
    this.neighbors[u].push(v);
  }

  shortestPath(start, end) {
    if (start == end) {
      return [start, end];
    }

    const queue = [start],
      visited = {},
      predecessor = {};
    let path,
      tail = 0;

    while (tail < queue.length) {
      let u = queue[tail++];
      if (!this.neighbors[u]) {
        continue;
      }

      const neighbors = this.neighbors[u];
      for (let i = 0; i < neighbors.length; ++i) {
        const v = neighbors[i];
        if (visited[v]) {
          continue;
        }
        visited[v] = true;
        if (v === end) {
          // Check if the path is complete.
          path = [v]; // If so, backtrack through the path.
          while (u !== start) {
            path.push(u);
            u = predecessor[u];
          }
          path.push(u);
          path.reverse();
          return path;
        }
        predecessor[v] = u;
        queue.push(v);
      }
    }

    return path;
  }
}
