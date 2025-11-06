import Course from './components/Course'

const Header = ({course}) => {
  console.log(course)
  return <h1>{course}</h1>
}

const Content = (props) => (
  <div>
    {props.parts.map(part => 
      <Part key={part.id} name={part.name} number={part.exercises} />
    )}
  </div>
)

const Part = (props) => (
   <p>{props.name} {props.number}</p>
)

const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0)
  return <p>Total of {total} exercises</p>
}


// App
//   Course
//     Header
//     Content
//       Part
//       Part
//       ...


const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]


  return (
    <div>
      {courses.map(course => (
        <Course key={course.id} course={course} />
      ))} 
    </div>
  )
}

export default App

//
