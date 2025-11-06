const Course = ({ course }) => (
  <div>
    <h2>{course.name}</h2>
    {course.parts.map(part => (
      <p key={part.id}>
        {part.name} {part.exercises}
      </p>
    ))}
  </div>
)

export default Course
