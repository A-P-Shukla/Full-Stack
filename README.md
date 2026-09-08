# Full Stack Open

Solutions and projects completed while working through the University of Helsinki's [Full Stack Open](https://fullstackopen.com/en/) course.

The course covers modern JavaScript-based web development, from React fundamentals to REST APIs, databases, testing, authentication, state management, and routing.

## Course Certificate

[View the Full Stack Open certificate](https://studies.cs.helsinki.fi/stats/api/certificate/fullstackopen/en/463ec16dadab724c86983835bdb32e07)

[![Full Stack Open certificate](https://studies.cs.helsinki.fi/stats/api/certificate/fullstackopen/en/463ec16dadab724c86983835bdb32e07)](https://studies.cs.helsinki.fi/stats/api/certificate/fullstackopen/en/463ec16dadab724c86983835bdb32e07)

## Repository Contents

| Part | Topics and projects |
| --- | --- |
| [Part 0](part0/) | General information and sequence diagrams |
| [Part 1](part1/) | React fundamentals: `courseinfo`, `unicafe`, and `anecdotes` |
| [Part 2](part2/) | Rendering collections, forms, HTTP requests, and Axios: `courseinfo`, `phonebook`, and `countries` |
| [Part 3](part3/) | Node.js and Express backend for the phonebook application |
| [Part 4](part4/) | Testing, authentication, and MongoDB backend for the bloglist application |
| [Part 5](part5/) | React testing and the bloglist frontend |
| [Part 6](part6/) | State management with React Query and Zustand: `query-anecdotes`, `unicafe`, and `zustand-anecdotes` |
| [Part 7](part7/) | React Router and the `routed-anecdotes` application |

## Main Technologies

- JavaScript and JSX
- React and Vite
- Node.js and Express
- MongoDB and Mongoose
- Axios
- React Router
- React Query and Zustand
- Jest-style API testing with SuperTest and Node's test runner
- Vitest and React Testing Library
- Playwright

## Running a Project

Each application is a separate npm project. From the repository root, move into the project directory, install its dependencies, and start it:

```bash
cd part1/anecdotes
npm install
npm run dev
```

For another project, replace the path with its directory. For example:

```bash
cd part5/bloglist-frontend
npm install
npm run dev
```

Backend projects can be started with their available scripts:

```bash
cd part3/phonebook-backend
npm install
npm run dev
```

The Part 4 backend also supports tests:

```bash
cd part4/bloglist-backend
npm install
npm test
```

The Part 5 frontend includes unit tests and linting:

```bash
cd part5/bloglist-frontend
npm test
npm run lint
```

Some backend applications require environment variables for MongoDB and authentication. Check the relevant project source and configuration files before starting them.

